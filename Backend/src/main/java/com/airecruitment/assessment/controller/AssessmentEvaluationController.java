package com.airecruitment.assessment.controller;

import com.airecruitment.assessment.dto.AssessmentEvaluationResponse;
import com.airecruitment.assessment.dto.SubmitAssessmentRequest;
import com.airecruitment.assessment.service.AssessmentEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentEvaluationController {

    private final AssessmentEvaluationService assessmentEvaluationService;

    @PostMapping("/{assessmentId}/submit")
    public AssessmentEvaluationResponse submitAssessment(
            @PathVariable Long assessmentId,
            @RequestBody SubmitAssessmentRequest request
    ) {

        return assessmentEvaluationService.submitAssessment(
                assessmentId,
                request
        );
    }
}