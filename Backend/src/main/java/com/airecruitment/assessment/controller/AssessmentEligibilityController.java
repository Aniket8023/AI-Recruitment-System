package com.airecruitment.assessment.controller;

import com.airecruitment.assessment.dto.InterviewEligibilityResponse;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentEligibilityController {

    private final AssessmentRepository assessmentRepository;

    private final AssessmentResultRepository assessmentResultRepository;

    @GetMapping("/{assessmentId}/interview-eligibility")
    public InterviewEligibilityResponse checkInterviewEligibility(
            @PathVariable Long assessmentId
    ) {

        Assessment assessment = assessmentRepository
                .findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found: " + assessmentId
                        )
                );

        AssessmentResult result = assessmentResultRepository
                .findByAssessment(assessment)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment result not found."
                        )
                );

        boolean eligible =
                Boolean.TRUE.equals(result.getPassed());

        String message;

        if (eligible) {

            message =
                    "Candidate passed the assessment and is eligible "
                            + "for the AI interview.";

        } else {

            message =
                    "Candidate did not pass the assessment and is not "
                            + "eligible for the AI interview.";
        }

        return InterviewEligibilityResponse.builder()
                .assessmentId(assessmentId)
                .eligible(eligible)
                .overallScore(result.getOverallScore())
                .passed(result.getPassed())
                .recommendation(result.getRecommendation())
                .message(message)
                .build();
    }
}