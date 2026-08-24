package com.airecruitment.assessment.dto;

import com.airecruitment.assessment.enums.QuestionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentQuestionResponse {

    private Long questionId;

    private String questionText;

    private QuestionType questionType;

    private String options;

    private String difficulty;

    private String topic;

    private Integer questionOrder;
}