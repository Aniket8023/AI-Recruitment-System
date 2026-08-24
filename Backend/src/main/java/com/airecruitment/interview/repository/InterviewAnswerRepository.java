package com.airecruitment.interview.repository;

import com.airecruitment.interview.entity.InterviewAnswer;
import com.airecruitment.interview.entity.InterviewQuestion;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewAnswerRepository
        extends JpaRepository<InterviewAnswer, Long> {

    Optional<InterviewAnswer> findByCandidateAndQuestion(
            User candidate,
            InterviewQuestion question
    );

    List<InterviewAnswer> findByCandidate(User candidate);
}