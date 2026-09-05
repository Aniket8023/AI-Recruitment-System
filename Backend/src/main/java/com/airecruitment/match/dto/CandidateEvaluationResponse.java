package com.airecruitment.match.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateEvaluationResponse {

    private Long candidateId;

    private Long jobId;

    private Long resumeId;

    private String candidateName;

    private String jobTitle;

    private Double matchScore;

    private Double assessmentScore;

    private Boolean assessmentPassed;

    private Double interviewScore;

    private String interviewRecommendation;

    private String finalRecommendation;

    private String status;
}