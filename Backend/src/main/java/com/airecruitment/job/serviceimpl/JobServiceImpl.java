package com.airecruitment.job.serviceimpl;

import com.airecruitment.common.enums.UserRole;
import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.job.service.JobService;
import com.airecruitment.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    @Override
    public JobResponse createJob(CreateJobRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User recruiter = (User) authentication.getPrincipal();

        if (recruiter.getRole() != UserRole.RECRUITER) {
            throw new RuntimeException(
                    "Only recruiters can create jobs."
            );
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills())
                .preferredSkills(request.getPreferredSkills())
                .experienceRequired(request.getExperienceRequired())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .workMode(request.getWorkMode())
                .recruiter(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);
    }

    private JobResponse mapToResponse(Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requiredSkills(job.getRequiredSkills())
                .preferredSkills(job.getPreferredSkills())
                .experienceRequired(job.getExperienceRequired())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .workMode(job.getWorkMode())
                .status(job.getStatus())
                .recruiterId(job.getRecruiter().getId())
                .build();
    }
}