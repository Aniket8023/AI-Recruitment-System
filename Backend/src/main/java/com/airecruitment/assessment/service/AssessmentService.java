package com.airecruitment.assessment.service;

import com.airecruitment.assessment.dto.AssessmentEvaluationResponse;
import com.airecruitment.assessment.dto.AssessmentResponse;

import java.util.List;

public interface AssessmentService {

    AssessmentResponse createAssessment(
            Long jobId,
            Long resumeId
    );

    List<AssessmentResponse> getMyAssessments();

    AssessmentEvaluationResponse getAssessmentResult(
            Long assessmentId
    );
}