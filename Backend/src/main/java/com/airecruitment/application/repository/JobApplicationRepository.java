package com.airecruitment.application.repository;

import com.airecruitment.application.entity.JobApplication;
import com.airecruitment.common.enums.ApplicationStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    Optional<JobApplication> findByCandidateAndJob(
            User candidate,
            Job job
    );


    boolean existsByCandidateAndJob(
            User candidate,
            Job job
    );


    List<JobApplication> findByCandidate(
            User candidate
    );


    List<JobApplication> findByCandidateAndStatus(
            User candidate,
            ApplicationStatus status
    );


    List<JobApplication> findByJob(
            Job job
    );


    List<JobApplication> findByJobAndStatus(
            Job job,
            ApplicationStatus status
    );


    Optional<JobApplication> findByJobAndResume(
            Job job,
            Resume resume
    );
}