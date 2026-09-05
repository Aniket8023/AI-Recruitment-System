package com.airecruitment.application.dto;

import com.airecruitment.common.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JobApplicationResponse {

    private Long applicationId;

    private Long candidateId;

    private Long jobId;

    private String jobTitle;

    private Long resumeId;

    private ApplicationStatus status;
}