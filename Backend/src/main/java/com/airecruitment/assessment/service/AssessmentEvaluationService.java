package com.airecruitment.assessment.service;

import com.airecruitment.assessment.dto.AssessmentEvaluationResponse;
import com.airecruitment.assessment.dto.SubmitAssessmentRequest;

public interface AssessmentEvaluationService {

    AssessmentEvaluationResponse submitAssessment(
            Long assessmentId,
            SubmitAssessmentRequest request
    );
}