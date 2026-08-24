package com.airecruitment.interview.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewEvaluationResponse {

    private Double score;

    private String feedback;

    private String evaluationStatus;
}