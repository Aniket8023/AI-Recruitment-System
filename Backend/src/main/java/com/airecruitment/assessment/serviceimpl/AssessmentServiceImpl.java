package com.airecruitment.assessment.serviceimpl;

import com.airecruitment.application.entity.JobApplication;
import com.airecruitment.application.repository.JobApplicationRepository;
import com.airecruitment.assessment.dto.AssessmentResponse;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.assessment.enums.AssessmentType;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.service.AssessmentService;
import com.airecruitment.common.enums.ApplicationStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.match.repository.JobMatchRepository;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl
        implements AssessmentService {

    private final AssessmentRepository assessmentRepository;

    private final JobRepository jobRepository;

    private final ResumeRepository resumeRepository;

    private final JobMatchRepository jobMatchRepository;

    private final JobApplicationRepository jobApplicationRepository;


    // =========================================================
    // CREATE ASSESSMENT
    // =========================================================

    @Override
    @Transactional
    public AssessmentResponse createAssessment(
            Long jobId,
            Long resumeId) {

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
        // 2. CHECK CANDIDATE ROLE
        // =====================================================

        if (candidate.getRole() != UserRole.CANDIDATE) {

            throw new RuntimeException(
                    "Only candidates can create assessments."
            );
        }


        // =====================================================
        // 3. FIND JOB
        // =====================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found: "
                                                + jobId
                                )
                        );


        // =====================================================
        // 4. FIND RESUME
        // =====================================================

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found: "
                                                + resumeId
                                )
                        );


        // =====================================================
        // 5. VALIDATE RESUME OWNERSHIP
        // =====================================================

        if (!resume.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "Resume does not belong to this candidate."
            );
        }


        // =====================================================
        // 6. FIND JOB APPLICATION
        // =====================================================

        JobApplication application =
                jobApplicationRepository
                        .findByCandidateAndJob(
                                candidate,
                                job
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job application not found. "
                                                + "Candidate must apply "
                                                + "for the job first."
                                )
                        );


        // =====================================================
        // 7. VALIDATE APPLICATION RESUME
        // =====================================================

        if (!application.getResume()
                .getId()
                .equals(resumeId)) {

            throw new RuntimeException(
                    "The selected resume does not match "
                            + "the resume used in the job application."
            );
        }


        // =====================================================
        // 8. CHECK APPLICATION STATUS
        // =====================================================

        if (application.getStatus()
                != ApplicationStatus.MATCHED) {

            throw new RuntimeException(
                    "Candidate is not eligible for assessment. "
                            + "Application status: "
                            + application.getStatus()
            );
        }


        // =====================================================
        // 9. CHECK JOB MATCH
        // =====================================================

        JobMatch jobMatch =
                jobMatchRepository
                        .findByJobIdAndResumeId(
                                jobId,
                                resumeId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate is not matched "
                                                + "with this job."
                                )
                        );


        // =====================================================
        // 10. CHECK WHETHER ASSESSMENT ALREADY EXISTS
        // =====================================================

        assessmentRepository
                .findByCandidateAndJob(
                        candidate,
                        job
                )
                .ifPresent(existingAssessment -> {

                    throw new RuntimeException(
                            "Assessment already exists "
                                    + "for this candidate and job."
                    );

                });


        // =====================================================
        // 11. CREATE ASSESSMENT
        // =====================================================

        Assessment assessment =
                Assessment.builder()

                        .candidate(candidate)

                        .job(job)

                        .resume(resume)

                        .type(
                                AssessmentType.MIXED
                        )

                        .status(
                                AssessmentStatus.CREATED
                        )

                        .totalQuestions(20)

                        .durationMinutes(45)

                        .build();


        // =====================================================
        // 12. SAVE ASSESSMENT
        // =====================================================

        Assessment savedAssessment =
                assessmentRepository.save(
                        assessment
                );


        // =====================================================
        // 13. UPDATE APPLICATION STATUS
        // =====================================================

        application.setStatus(
                ApplicationStatus.ASSESSMENT_PENDING
        );

        jobApplicationRepository.save(
                application
        );


        // =====================================================
        // 14. CONVERT ENTITY -> DTO
        // =====================================================

        return AssessmentResponse.builder()

                .assessmentId(
                        savedAssessment.getId()
                )

                .candidateId(
                        savedAssessment
                                .getCandidate()
                                .getId()
                )

                .jobId(
                        savedAssessment
                                .getJob()
                                .getId()
                )

                .resumeId(
                        savedAssessment
                                .getResume()
                                .getId()
                )

                .type(
                        savedAssessment.getType()
                )

                .status(
                        savedAssessment.getStatus()
                )

                .totalQuestions(
                        savedAssessment
                                .getTotalQuestions()
                )

                .durationMinutes(
                        savedAssessment
                                .getDurationMinutes()
                )

                .build();
    }
}