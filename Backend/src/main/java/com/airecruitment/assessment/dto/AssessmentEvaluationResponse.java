package com.airecruitment.assessment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentEvaluationResponse {

    private Long assessmentId;

    private Integer totalQuestions;

    private Integer attemptedQuestions;

    private Integer correctAnswers;

    private Double aptitudeScore;

    private Double technicalScore;

    private Double codingScore;

    private Double overallScore;

    private Boolean passed;

    private String recommendation;

    private String feedback;
}