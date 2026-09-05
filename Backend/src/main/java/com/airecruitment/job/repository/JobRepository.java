package com.airecruitment.job.repository;

import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository
        extends JpaRepository<Job, Long> {

    List<Job> findByRecruiter(User recruiter);

    List<Job> findByRecruiterAndStatus(
            User recruiter,
            JobStatus status
    );
}