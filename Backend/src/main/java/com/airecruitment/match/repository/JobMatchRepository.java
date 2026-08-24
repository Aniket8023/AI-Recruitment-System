package com.airecruitment.match.repository;

import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {

    Optional<JobMatch> findByJobAndResume(
            Job job,
            Resume resume
    );

    List<JobMatch> findByJobOrderByMatchScoreDesc(
            Job job
    );

    List<JobMatch> findByResumeOrderByMatchScoreDesc(
            Resume resume
    );

    List<JobMatch> findByJobAndStatusOrderByMatchScoreDesc(
            Job job,
            MatchStatus status
    );

    Optional<JobMatch> findByJobIdAndResumeId(
            Long jobId,
            Long resumeId
    );
}