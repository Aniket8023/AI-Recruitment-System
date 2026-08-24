package com.airecruitment.assessment.serviceimpl;

import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;
import com.airecruitment.assessment.service.AssessmentEligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssessmentEligibilityServiceImpl
        implements AssessmentEligibilityService {

    private final AssessmentRepository assessmentRepository;

    private final AssessmentResultRepository assessmentResultRepository;

    @Override
    public boolean isEligibleForInterview(Long assessmentId) {

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

        return Boolean.TRUE.equals(result.getPassed());
    }
}