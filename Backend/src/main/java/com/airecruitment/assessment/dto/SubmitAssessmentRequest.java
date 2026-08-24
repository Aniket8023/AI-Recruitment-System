package com.airecruitment.assessment.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAssessmentRequest {

    private List<AnswerSubmission> answers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerSubmission {

        private Long questionId;

        private String answer;
    }
}