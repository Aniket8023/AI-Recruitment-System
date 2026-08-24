package com.airecruitment.assessment.service;

import com.airecruitment.assessment.dto.AssessmentQuestionResponse;
import com.airecruitment.assessment.entity.AssessmentQuestion;

import java.util.List;

public interface AssessmentQuestionService {

    List<AssessmentQuestion> generateQuestions(Long assessmentId);

    List<AssessmentQuestionResponse> getQuestions(Long assessmentId);
}