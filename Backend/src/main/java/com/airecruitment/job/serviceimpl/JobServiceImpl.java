package com.airecruitment.job.serviceimpl;

import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.dto.UpdateJobRequest;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.job.service.JobService;
import com.airecruitment.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl
        implements JobService {

    private final JobRepository jobRepository;


    // =========================================================
    // CREATE JOB
    // =========================================================

    @Override
    @Transactional
    public JobResponse createJob(
            CreateJobRequest request) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                Job.builder()
                        .title(request.getTitle())
                        .description(
                                request.getDescription()
                        )
                        .requiredSkills(
                                request.getRequiredSkills()
                        )
                        .preferredSkills(
                                request.getPreferredSkills()
                        )
                        .experienceRequired(
                                request.getExperienceRequired()
                        )
                        .location(
                                request.getLocation()
                        )
                        .employmentType(
                                request.getEmploymentType()
                        )
                        .workMode(
                                request.getWorkMode()
                        )
                        .recruiter(recruiter)
                        .status(JobStatus.DRAFT)
                        .build();


        Job savedJob =
                jobRepository.save(job);


        return mapToResponse(savedJob);
    }


    // =========================================================
    // GET SINGLE JOB
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJob(
            Long jobId) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                findJobForRecruiter(
                        jobId,
                        recruiter
                );


        return mapToResponse(job);
    }


    // =========================================================
    // GET ALL MY JOBS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs() {

        User recruiter =
                getAuthenticatedRecruiter();


        return jobRepository
                .findByRecruiter(recruiter)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET MY JOBS BY STATUS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobsByStatus(
            JobStatus status) {

        User recruiter =
                getAuthenticatedRecruiter();


        return jobRepository
                .findByRecruiterAndStatus(
                        recruiter,
                        status
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // UPDATE JOB
    // =========================================================

    @Override
    @Transactional
    public JobResponse updateJob(
            Long jobId,
            UpdateJobRequest request) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                findJobForRecruiter(
                        jobId,
                        recruiter
                );


        // Do not allow updating archived jobs

        if (job.getStatus() ==
                JobStatus.ARCHIVED) {

            throw new RuntimeException(
                    "Archived job cannot be updated."
            );
        }


        // Do not allow updating closed jobs

        if (job.getStatus() ==
                JobStatus.CLOSED) {

            throw new RuntimeException(
                    "Closed job cannot be updated."
            );
        }


        job.setTitle(
                request.getTitle()
        );

        job.setDescription(
                request.getDescription()
        );

        job.setRequiredSkills(
                request.getRequiredSkills()
        );

        job.setPreferredSkills(
                request.getPreferredSkills()
        );

        job.setExperienceRequired(
                request.getExperienceRequired()
        );

        job.setLocation(
                request.getLocation()
        );

        job.setEmploymentType(
                request.getEmploymentType()
        );

        job.setWorkMode(
                request.getWorkMode()
        );


        Job updatedJob =
                jobRepository.save(job);


        return mapToResponse(updatedJob);
    }


    // =========================================================
    // PUBLISH JOB
    // =========================================================

    @Override
    @Transactional
    public JobResponse publishJob(
            Long jobId) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                findJobForRecruiter(
                        jobId,
                        recruiter
                );


        if (job.getStatus() !=
                JobStatus.DRAFT) {

            throw new RuntimeException(
                    "Only draft jobs can be published."
            );
        }


        job.setStatus(
                JobStatus.PUBLISHED
        );


        Job updatedJob =
                jobRepository.save(job);


        return mapToResponse(updatedJob);
    }


    // =========================================================
    // CLOSE JOB
    // =========================================================

    @Override
    @Transactional
    public JobResponse closeJob(
            Long jobId) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                findJobForRecruiter(
                        jobId,
                        recruiter
                );


        if (job.getStatus() !=
                JobStatus.PUBLISHED) {

            throw new RuntimeException(
                    "Only published jobs can be closed."
            );
        }


        job.setStatus(
                JobStatus.CLOSED
        );


        Job updatedJob =
                jobRepository.save(job);


        return mapToResponse(updatedJob);
    }


    // =========================================================
    // ARCHIVE JOB
    // =========================================================

    @Override
    @Transactional
    public JobResponse archiveJob(
            Long jobId) {

        User recruiter =
                getAuthenticatedRecruiter();


        Job job =
                findJobForRecruiter(
                        jobId,
                        recruiter
                );


        if (job.getStatus() !=
                JobStatus.CLOSED) {

            throw new RuntimeException(
                    "Only closed jobs can be archived."
            );
        }


        job.setStatus(
                JobStatus.ARCHIVED
        );


        Job updatedJob =
                jobRepository.save(job);


        return mapToResponse(updatedJob);
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


        User user =
                (User) principal;


        if (user.getRole() !=
                UserRole.RECRUITER) {

            throw new RuntimeException(
                    "Only recruiters can manage jobs."
            );
        }


        return user;
    }


    // =========================================================
    // FIND JOB FOR CURRENT RECRUITER
    // =========================================================

    private Job findJobForRecruiter(
            Long jobId,
            User recruiter) {

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        if (!job.getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You are not authorized to manage this job."
            );
        }


        return job;
    }


    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private JobResponse mapToResponse(
            Job job) {

        return JobResponse.builder()

                .id(
                        job.getId()
                )

                .title(
                        job.getTitle()
                )

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
                        job.getRecruiter().getId()
                )

                .build();
    }
}