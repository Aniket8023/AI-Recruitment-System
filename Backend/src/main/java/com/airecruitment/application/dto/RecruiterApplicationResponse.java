package com.airecruitment.application.dto;

import com.airecruitment.common.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecruiterApplicationResponse {

    private Long applicationId;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long jobId;

    private String jobTitle;

    private Long resumeId;

    private ApplicationStatus status;
}