package com.airecruitment.interview.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewResultResponse {

    private Long candidateId;

    private Long jobId;

    private Integer totalQuestions;

    private Integer answeredQuestions;

    private Double averageScore;

    private Double overallScore;

    private Double technicalScore;

    private Double hrScore;

    private Double skillGapScore;

    private String recommendation;

    private String summary;
}