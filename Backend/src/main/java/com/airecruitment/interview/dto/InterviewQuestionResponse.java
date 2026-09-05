package com.airecruitment.interview.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {

    private Long questionId;

    private String question;

    private String type;

    private String difficulty;
}