package com.airecruitment.assessment.controller;

import com.airecruitment.assessment.dto.AssessmentResponse;
import com.airecruitment.assessment.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping("/jobs/{jobId}/resumes/{resumeId}")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentResponse createAssessment(
            @PathVariable Long jobId,
            @PathVariable Long resumeId
    ) {

        return assessmentService.createAssessment(
                jobId,
                resumeId
        );
    }
}