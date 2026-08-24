package com.airecruitment.assessment.repository;

import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentAnswer;
import com.airecruitment.assessment.entity.AssessmentQuestion;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentAnswerRepository
        extends JpaRepository<AssessmentAnswer, Long> {

    List<AssessmentAnswer> findByAssessment(
            Assessment assessment
    );

    Optional<AssessmentAnswer> findByAssessmentAndQuestionAndCandidate(
            Assessment assessment,
            AssessmentQuestion question,
            User candidate
    );
}