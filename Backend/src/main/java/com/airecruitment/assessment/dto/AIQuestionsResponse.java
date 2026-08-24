package com.airecruitment.assessment.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AIQuestionsResponse {

    private List<AIQuestionResponse> questions;
}