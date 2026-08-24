package com.airecruitment.assessment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIQuestionResponse {

    private String questionText;

    private String questionType;

    private String options;

    private String correctAnswer;

    private String difficulty;

    private String topic;
}