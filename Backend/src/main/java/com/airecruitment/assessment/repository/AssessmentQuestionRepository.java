package com.airecruitment.assessment.repository;

import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentQuestionRepository
        extends JpaRepository<AssessmentQuestion, Long> {

    List<AssessmentQuestion> findByAssessmentOrderByQuestionOrderAsc(
            Assessment assessment
    );

    List<AssessmentQuestion> findByAssessmentOrderByQuestionOrder(
            Assessment assessment
    );

    long countByAssessment(Assessment assessment);
}