package com.airecruitment.assessment.service;

import com.airecruitment.assessment.dto.AssessmentResponse;

public interface AssessmentService {

    AssessmentResponse createAssessment(
            Long jobId,
            Long resumeId
    );
}