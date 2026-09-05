package com.airecruitment.application.serviceimpl;

import com.airecruitment.application.dto.ApplyJobRequest;
import com.airecruitment.application.dto.JobApplicationResponse;
import com.airecruitment.application.entity.JobApplication;
import com.airecruitment.application.repository.JobApplicationRepository;
import com.airecruitment.application.service.JobApplicationService;
import com.airecruitment.common.enums.ApplicationStatus;
import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.airecruitment.match.service.JobMatchingService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl
        implements JobApplicationService {

    private final JobRepository jobRepository;

    private final ResumeRepository resumeRepository;

    private final JobApplicationRepository jobApplicationRepository;


    private final JobMatchingService jobMatchingService;

    // =========================================================
    // APPLY FOR JOB
    // =========================================================

    @Override
    @Transactional
    public JobApplicationResponse applyForJob(
            Long jobId,
            ApplyJobRequest request) {

        // =====================================================
        // 1. GET LOGGED-IN USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User candidate =
                (User) authentication.getPrincipal();


        // =====================================================
        // 2. VALIDATE CANDIDATE ROLE
        // =====================================================

        if (candidate.getRole() != UserRole.CANDIDATE) {

            throw new RuntimeException(
                    "Only candidates can apply for jobs."
            );
        }


        // =====================================================
        // 3. FIND JOB
        // =====================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found with id: "
                                                + jobId
                                )
                        );


        // =====================================================
        // 4. CHECK JOB STATUS
        // =====================================================

        if (job.getStatus() != JobStatus.PUBLISHED) {

            throw new RuntimeException(
                    "Candidate can only apply for published jobs."
            );
        }


        // =====================================================
        // 5. FIND RESUME
        // =====================================================

        Resume resume =
                resumeRepository.findById(
                        request.getResumeId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found with id: "
                                        + request.getResumeId()
                        )
                );


        // =====================================================
        // 6. VALIDATE RESUME OWNERSHIP
        // =====================================================

        if (!resume.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "You can only apply using your own resume."
            );
        }


        // =====================================================
        // 7. CHECK DUPLICATE APPLICATION
        // =====================================================

        boolean alreadyApplied =
                jobApplicationRepository
                        .existsByCandidateAndJob(
                                candidate,
                                job
                        );

        if (alreadyApplied) {

            throw new RuntimeException(
                    "You have already applied for this job."
            );
        }


        // =====================================================
        // 8. CREATE APPLICATION
        // =====================================================

        JobApplication application =
                JobApplication.builder()
                        .candidate(candidate)
                        .job(job)
                        .resume(resume)
                        .status(
                                ApplicationStatus.APPLIED
                        )
                        .build();


        // =====================================================
        // 9. SAVE APPLICATION
        // =====================================================

        JobApplication savedApplication =
                jobApplicationRepository.save(
                        application
                );


// =====================================================
// AI JOB MATCHING
// =====================================================

        try {

            jobMatchingService.matchJobWithResume(
                    job.getId(),
                    resume.getId()
            );

            // Matching successful
            savedApplication.setStatus(
                    ApplicationStatus.MATCHED
            );

            savedApplication =
                    jobApplicationRepository.save(
                            savedApplication
                    );

        } catch (Exception e) {

            // Application should remain successful
            // even if AI matching fails

            System.out.println(
                    "AI matching failed for application "
                            + savedApplication.getId()
                            + ": "
                            + e.getMessage()
            );
        }


// =====================================================
// RETURN RESPONSE
// =====================================================

        return mapToResponse(savedApplication);
    }


    // =========================================================
    // GET MY APPLICATIONS
    // =========================================================

    @Override
    public List<JobApplicationResponse> getMyApplications() {

        // =====================================================
        // 1. GET LOGGED-IN USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User candidate =
                (User) authentication.getPrincipal();


        // =====================================================
        // 2. VALIDATE ROLE
        // =====================================================

        if (candidate.getRole() != UserRole.CANDIDATE) {

            throw new RuntimeException(
                    "Only candidates can view their applications."
            );
        }


        // =====================================================
        // 3. FIND APPLICATIONS
        // =====================================================

        List<JobApplication> applications =
                jobApplicationRepository
                        .findByCandidate(candidate);


        // =====================================================
        // 4. CONVERT TO RESPONSE
        // =====================================================

        return applications.stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET APPLICATION BY ID
    // =========================================================

    @Override
    public JobApplicationResponse getApplication(
            Long applicationId) {

        // =====================================================
        // 1. GET LOGGED-IN USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User candidate =
                (User) authentication.getPrincipal();


        // =====================================================
        // 2. FIND APPLICATION
        // =====================================================

        JobApplication application =
                jobApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );


        // =====================================================
        // 3. VALIDATE OWNERSHIP
        // =====================================================

        if (!application.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this application."
            );
        }


        // =====================================================
        // 4. RETURN RESPONSE
        // =====================================================

        return mapToResponse(application);
    }


    // =========================================================
    // MAP ENTITY -> RESPONSE
    // =========================================================

    private JobApplicationResponse mapToResponse(
            JobApplication application) {

        return JobApplicationResponse.builder()

                .applicationId(
                        application.getId()
                )

                .candidateId(
                        application.getCandidate()
                                .getId()
                )

                .jobId(
                        application.getJob()
                                .getId()
                )

                .jobTitle(
                        application.getJob()
                                .getTitle()
                )

                .resumeId(
                        application.getResume()
                                .getId()
                )

                .status(
                        application.getStatus()
                )

                .build();
    }
}