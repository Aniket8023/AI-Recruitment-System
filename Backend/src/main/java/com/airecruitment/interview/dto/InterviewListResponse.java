package com.airecruitment.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewListResponse {

    private Long jobId;

    private Long candidateId;

    private Long resumeId;

    private String jobTitle;

    private Integer totalQuestions;

    private String status;

    private Double overallScore;

    private String recommendation;
}