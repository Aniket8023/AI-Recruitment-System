package com.airecruitment.application.dto;

import com.airecruitment.common.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterCandidateResponse {

    private Long applicationId;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long jobId;
    private String jobTitle;

    private Long resumeId;

    private ApplicationStatus applicationStatus;

    private Double matchScore;
    private String recommendation;
}