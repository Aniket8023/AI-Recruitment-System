package com.airecruitment.assessment.repository;

import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository
        extends JpaRepository<Assessment, Long> {

    List<Assessment> findByCandidate(User candidate);

    List<Assessment> findByJob(Job job);

    Optional<Assessment> findByCandidateAndJob(
            User candidate,
            Job job
    );

    List<Assessment> findByCandidateAndStatus(
            User candidate,
            AssessmentStatus status
    );

    Optional<Assessment> findByCandidateAndJobAndResume(
            User candidate,
            Job job,
            Resume resume
    );
}