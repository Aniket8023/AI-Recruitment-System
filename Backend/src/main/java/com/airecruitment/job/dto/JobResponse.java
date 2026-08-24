package com.airecruitment.job.dto;

import com.airecruitment.common.enums.JobStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobResponse {

    private Long id;

    private String title;

    private String description;

    private String requiredSkills;

    private String preferredSkills;

    private String experienceRequired;

    private String location;

    private String employmentType;

    private String workMode;

    private JobStatus status;

    private Long recruiterId;
}