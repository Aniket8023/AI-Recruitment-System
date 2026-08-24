package com.airecruitment.assessment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewEligibilityResponse {

    private Long assessmentId;

    private Boolean eligible;

    private Double overallScore;

    private Boolean passed;

    private String recommendation;

    private String message;
}