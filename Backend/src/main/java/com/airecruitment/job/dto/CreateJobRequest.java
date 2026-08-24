package com.airecruitment.job.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requiredSkills;

    private String preferredSkills;

    private String experienceRequired;

    private String location;

    private String employmentType;

    private String workMode;
}