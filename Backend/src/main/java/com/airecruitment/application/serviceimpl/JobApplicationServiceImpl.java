package com.airecruitment.application.serviceimpl;

import com.airecruitment.application.dto.*;
import com.airecruitment.application.entity.JobApplication;
import com.airecruitment.application.repository.JobApplicationRepository;
import com.airecruitment.application.service.JobApplicationService;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;
import com.airecruitment.common.enums.ApplicationStatus;
import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.interview.entity.InterviewResult;
import com.airecruitment.interview.repository.InterviewResultRepository;
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

    private final AssessmentRepository assessmentRepository;

    private final AssessmentResultRepository assessmentResultRepository;

    private final InterviewResultRepository interviewResultRepository;

    private final JobMatchRepository jobMatchRepository;
    // =========================================================
    // APPLY FOR JOB
    // =========================================================

    @Override
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

    // =========================================================
// GET RECRUITER APPLICATIONS
// =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<RecruiterApplicationResponse>
    getRecruiterApplications() {

        // =====================================================
        // 1. GET LOGGED-IN USER
        // =====================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        // =====================================================
        // 2. GET USER
        // =====================================================

        Object principal =
                authentication.getPrincipal();

        if (!(principal instanceof User)) {

            throw new RuntimeException(
                    "Invalid authentication principal."
            );
        }

        User recruiter =
                (User) principal;


        // =====================================================
        // 3. VALIDATE RECRUITER ROLE
        // =====================================================

        if (recruiter.getRole() !=
                UserRole.RECRUITER) {

            throw new RuntimeException(
                    "Only recruiters can view recruiter applications."
            );
        }


        // =====================================================
        // 4. GET RECRUITER'S JOBS
        // =====================================================

        List<Job> recruiterJobs =
                jobRepository.findByRecruiter(
                        recruiter
                );


        // =====================================================
        // 5. GET APPLICATIONS FOR THOSE JOBS
        // =====================================================

        return recruiterJobs.stream()

                .flatMap(job ->
                        jobApplicationRepository
                                .findByJob(job)
                                .stream()
                )

                .map(this::mapToRecruiterResponse)

                .toList();
    }

    // =========================================================
// MAP ENTITY -> RECRUITER RESPONSE
// =========================================================

    private RecruiterApplicationResponse
    mapToRecruiterResponse(
            JobApplication application) {

        return RecruiterApplicationResponse.builder()

                .applicationId(
                        application.getId()
                )

                .candidateId(
                        application.getCandidate()
                                .getId()
                )

                .candidateName(
                        application.getCandidate()
                                .getFullName()
                )

                .candidateEmail(
                        application.getCandidate()
                                .getEmail()
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


    @Override
    public List<RecruiterCandidateResponse> getRecruiterCandidates() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User recruiter)) {

            throw new RuntimeException(
                    "Authenticated recruiter not found."
            );
        }

        if (recruiter.getRole() != UserRole.RECRUITER &&
                recruiter.getRole() != UserRole.COMPANY_ADMIN) {

            throw new RuntimeException(
                    "Only recruiters can access candidates."
            );
        }

        List<JobApplication> applications =
                jobApplicationRepository
                        .findByJobRecruiterOrderByCreatedAtDesc(
                                recruiter
                        );

        return applications.stream()
                .map(application -> {

                    Job job = application.getJob();
                    Resume resume = application.getResume();
                    User candidate = application.getCandidate();

                    JobMatch jobMatch =
                            jobMatchRepository
                                    .findByJobAndResume(
                                            job,
                                            resume
                                    )
                                    .orElse(null);

                    return RecruiterCandidateResponse.builder()
                            .applicationId(application.getId())

                            .candidateId(candidate.getId())
                            .candidateName(candidate.getFullName())
                            .candidateEmail(candidate.getEmail())

                            .jobId(job.getId())
                            .jobTitle(job.getTitle())

                            .resumeId(resume.getId())

                            .applicationStatus(
                                    application.getStatus()
                            )

                            .matchScore(
                                    jobMatch != null
                                            ? jobMatch.getMatchScore()
                                            : null
                            )

                            .recommendation(
                                    jobMatch != null
                                            ? jobMatch.getRecommendation()
                                            : null
                            )

                            .build();
                })
                .toList();
    }


    @Override
    public RecruiterCandidateDetailsResponse getRecruiterCandidateDetails(
            Long applicationId
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !(authentication.getPrincipal() instanceof User recruiter)) {

            throw new RuntimeException(
                    "Authenticated recruiter not found."
            );
        }

        if (recruiter.getRole() != UserRole.RECRUITER &&
                recruiter.getRole() != UserRole.COMPANY_ADMIN) {

            throw new RuntimeException(
                    "Only recruiters can access candidate details."
            );
        }

        JobApplication application =
                jobApplicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found."
                                )
                        );

        Job job = application.getJob();

        if (job.getRecruiter() == null ||
                !job.getRecruiter()
                        .getId()
                        .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this candidate."
            );
        }

        User candidate = application.getCandidate();
        Resume resume = application.getResume();

    /* =====================================================
       AI JOB MATCH
       ===================================================== */

        JobMatch jobMatch =
                jobMatchRepository
                        .findByJobAndResume(
                                job,
                                resume
                        )
                        .orElse(null);

    /* =====================================================
       ASSESSMENT
       ===================================================== */

        Assessment assessment =
                assessmentRepository
                        .findByCandidateAndJobAndResume(
                                candidate,
                                job,
                                resume
                        )
                        .orElse(null);

        AssessmentResult assessmentResult = null;

        if (assessment != null) {

            assessmentResult =
                    assessmentResultRepository
                            .findByAssessment(assessment)
                            .orElse(null);
        }

    /* =====================================================
       INTERVIEW
       ===================================================== */

        InterviewResult interviewResult =
                interviewResultRepository
                        .findByCandidateIdAndJobId(
                                candidate.getId(),
                                job.getId()
                        )
                        .orElse(null);

    /* =====================================================
       RESPONSE BUILDER
       ===================================================== */

        RecruiterCandidateDetailsResponse
                .RecruiterCandidateDetailsResponseBuilder response =
                RecruiterCandidateDetailsResponse.builder()

                        .applicationId(
                                application.getId()
                        )

                        .candidateId(
                                candidate.getId()
                        )

                        .candidateName(
                                candidate.getFullName()
                        )

                        .candidateEmail(
                                candidate.getEmail()
                        )

                        .candidatePhone(
                                candidate.getPhone()
                        )

                        .jobId(
                                job.getId()
                        )

                        .jobTitle(
                                job.getTitle()
                        )

                        .resumeId(
                                resume.getId()
                        )

                        .applicationStatus(
                                application.getStatus()
                        );

    /* =====================================================
       AI MATCH DATA
       ===================================================== */

        if (jobMatch != null) {

            response
                    .matchScore(
                            jobMatch.getMatchScore()
                    )

                    .recommendation(
                            jobMatch.getRecommendation()
                    )

                    .matchedTechnicalSkills(
                            jobMatch.getMatchedTechnicalSkills()
                    )

                    .missingTechnicalSkills(
                            jobMatch.getMissingTechnicalSkills()
                    )

                    .matchedSoftSkills(
                            jobMatch.getMatchedSoftSkills()
                    )

                    .strengths(
                            jobMatch.getStrengths()
                    )

                    .skillGaps(
                            jobMatch.getSkillGaps()
                    )

                    .matchExplanation(
                            jobMatch.getExplanation()
                    );
        }

    /* =====================================================
       ASSESSMENT DATA
       ===================================================== */

        if (assessment != null) {

            response
                    .assessmentId(
                            assessment.getId()
                    )

                    .assessmentStatus(
                            assessment.getStatus() != null
                                    ? assessment.getStatus().name()
                                    : null
                    )

                    .assessmentTotalQuestions(
                            assessment.getTotalQuestions()
                    );
        }

        if (assessmentResult != null) {

            response
                    .assessmentCorrectAnswers(
                            assessmentResult.getCorrectAnswers()
                    )

                    .assessmentScore(
                            assessmentResult.getOverallScore()
                    )

                    .assessmentPassed(
                            assessmentResult.getPassed()
                    );
        }

    /* =====================================================
       INTERVIEW DATA
       ===================================================== */

        if (interviewResult != null) {

            response
                    .interviewStatus(
                            interviewResult.getInterviewStatus()
                    )

                    .interviewTotalQuestions(
                            interviewResult.getTotalQuestions()
                    )

                    .interviewAnsweredQuestions(
                            interviewResult.getAnsweredQuestions()
                    )

                    .interviewScore(
                            interviewResult.getOverallScore()
                    )

                    .interviewRecommendation(
                            interviewResult.getRecommendation()
                    )

                    .interviewIntegrityViolation(
                            interviewResult.getIntegrityViolation()
                    )

                    .interviewViolationCount(
                            interviewResult.getViolationCount()
                    )

                    .interviewTerminationReason(
                            interviewResult.getTerminationReason()
                    );
        }

        return response.build();
    }
}