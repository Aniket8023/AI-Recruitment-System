package com.airecruitment.recruiter.servicempl;

import com.airecruitment.application.dto.RecruiterApplicationResponse;
import com.airecruitment.application.entity.JobApplication;
import com.airecruitment.application.repository.JobApplicationRepository;
import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.match.dto.RecruiterShortlistedResponse;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.match.repository.JobMatchRepository;
import com.airecruitment.recruiter.dto.RecruiterDashboardResponse;
import com.airecruitment.recruiter.service.RecruiterDashboardService;
import com.airecruitment.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardServiceImpl
        implements RecruiterDashboardService {

    private final JobRepository jobRepository;

    private final JobApplicationRepository
            jobApplicationRepository;

    private final JobMatchRepository
            jobMatchRepository;


    // =========================================================
    // GET RECRUITER DASHBOARD
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardResponse getDashboard() {

        User recruiter =
                getAuthenticatedRecruiter();


        // =====================================================
        // 1. RECRUITER JOBS
        // =====================================================

        List<Job> jobs =
                jobRepository.findByRecruiter(
                        recruiter
                );


        // =====================================================
        // 2. TOTAL JOBS
        // =====================================================

        long totalJobs =
                jobs.size();


        // =====================================================
        // 3. ACTIVE JOBS
        // =====================================================

        long activeJobs =
                jobs.stream()
                        .filter(job ->
                                job.getStatus() ==
                                        JobStatus.PUBLISHED
                        )
                        .count();


        // =====================================================
        // 4. ALL APPLICATIONS
        // =====================================================

        List<JobApplication> applications =
                jobs.stream()
                        .flatMap(job ->
                                jobApplicationRepository
                                        .findByJob(job)
                                        .stream()
                        )
                        .toList();


        long totalApplications =
                applications.size();


        // =====================================================
        // 5. SHORTLISTED CANDIDATES
        // =====================================================

        List<JobMatch> shortlisted =
                jobMatchRepository
                        .findByJobRecruiterAndStatusOrderByCreatedAtDesc(
                                recruiter,
                                MatchStatus.SHORTLISTED
                        );


        long shortlistedCandidates =
                shortlisted.size();


        // =====================================================
        // 6. RECENT JOBS
        // =====================================================

        List<JobResponse> recentJobs =
                jobs.stream()
                        .sorted(
                                (a, b) ->
                                        b.getCreatedAt()
                                                .compareTo(
                                                        a.getCreatedAt()
                                                )
                        )
                        .limit(5)
                        .map(this::mapJob)
                        .toList();


        // =====================================================
        // 7. RECENT APPLICATIONS
        // =====================================================

        List<RecruiterApplicationResponse>
                recentApplications =
                applications.stream()
                        .sorted(
                                (a, b) ->
                                        b.getCreatedAt()
                                                .compareTo(
                                                        a.getCreatedAt()
                                                )
                        )
                        .limit(5)
                        .map(this::mapApplication)
                        .toList();


        // =====================================================
        // 8. RECENT SHORTLISTED
        // =====================================================

        List<RecruiterShortlistedResponse>
                recentShortlisted =
                shortlisted.stream()
                        .limit(5)
                        .map(this::mapShortlisted)
                        .toList();


        // =====================================================
        // 9. RESPONSE
        // =====================================================

        return RecruiterDashboardResponse.builder()

                .totalJobs(totalJobs)

                .activeJobs(activeJobs)

                .totalApplications(
                        totalApplications
                )

                .shortlistedCandidates(
                        shortlistedCandidates
                )

                .recentJobs(
                        recentJobs
                )

                .recentApplications(
                        recentApplications
                )

                .recentShortlistedCandidates(
                        recentShortlisted
                )

                .build();
    }


    // =========================================================
    // AUTHENTICATED RECRUITER
    // =========================================================

    private User getAuthenticatedRecruiter() {

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


        Object principal =
                authentication.getPrincipal();


        if (!(principal instanceof User)) {

            throw new RuntimeException(
                    "Invalid authentication principal."
            );
        }


        User recruiter =
                (User) principal;


        if (recruiter.getRole() == null ||
                (recruiter.getRole() != UserRole.RECRUITER &&
                        recruiter.getRole() != UserRole.COMPANY_ADMIN)) {

            throw new RuntimeException(
                    "Only recruiter or company admin can access this dashboard."
            );
        }

        return recruiter;
    }


    // =========================================================
    // JOB MAPPER
    // =========================================================

    private JobResponse mapJob(
            Job job) {

        return JobResponse.builder()

                .id(job.getId())

                .title(job.getTitle())

                .description(
                        job.getDescription()
                )

                .requiredSkills(
                        job.getRequiredSkills()
                )

                .preferredSkills(
                        job.getPreferredSkills()
                )

                .experienceRequired(
                        job.getExperienceRequired()
                )

                .location(
                        job.getLocation()
                )

                .employmentType(
                        job.getEmploymentType()
                )

                .workMode(
                        job.getWorkMode()
                )

                .status(
                        job.getStatus()
                )

                .recruiterId(
                        job.getRecruiter()
                                .getId()
                )

                .build();
    }


    // =========================================================
    // APPLICATION MAPPER
    // =========================================================

    private RecruiterApplicationResponse mapApplication(
            JobApplication application) {

        return RecruiterApplicationResponse.builder()

                .applicationId(application.getId())

                .candidateId(
                        application.getCandidate().getId()
                )

                .candidateName(
                        application.getCandidate().getFullName()
                )

                .candidateEmail(
                        application.getCandidate().getEmail()
                )

                .jobId(
                        application.getJob().getId()
                )

                .jobTitle(
                        application.getJob().getTitle()
                )

                .resumeId(
                        application.getResume().getId()
                )

                .status(
                        application.getStatus()
                )

                .build();
    }


    // =========================================================
    // SHORTLISTED MAPPER
    // =========================================================

    private RecruiterShortlistedResponse
    mapShortlisted(JobMatch match) {

        User candidate =
                match.getResume().getCandidate();

        JobApplication application =
                jobApplicationRepository
                        .findByJobAndResume(
                                match.getJob(),
                                match.getResume()
                        )
                        .orElse(null);

        return RecruiterShortlistedResponse.builder()

                .jobMatchId(
                        match.getId()
                )

                .applicationId(
                        application != null
                                ? application.getId()
                                : null
                )

                .jobId(
                        match.getJob().getId()
                )

                .jobTitle(
                        match.getJob().getTitle()
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

                .resumeId(
                        match.getResume().getId()
                )

                .matchScore(
                        match.getMatchScore()
                )

                .recommendation(
                        match.getRecommendation()
                )

                .status(
                        match.getStatus()
                )

                .build();
    }
}