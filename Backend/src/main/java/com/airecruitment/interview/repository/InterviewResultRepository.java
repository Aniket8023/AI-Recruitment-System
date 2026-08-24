package com.airecruitment.interview.repository;

import com.airecruitment.interview.entity.InterviewResult;
import com.airecruitment.job.entity.Job;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewResultRepository
        extends JpaRepository<InterviewResult, Long> {

    Optional<InterviewResult> findByCandidateAndJob(
            User candidate,
            Job job
    );
}