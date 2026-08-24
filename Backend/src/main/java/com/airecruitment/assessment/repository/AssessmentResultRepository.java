package com.airecruitment.assessment.repository;

import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssessmentResultRepository
        extends JpaRepository<AssessmentResult, Long> {

    Optional<AssessmentResult> findByAssessment(
            Assessment assessment
    );
}