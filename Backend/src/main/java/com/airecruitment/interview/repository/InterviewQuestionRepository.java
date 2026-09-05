package com.airecruitment.interview.repository;

import com.airecruitment.interview.entity.InterviewQuestion;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findByJobAndResume(
            Job job,
            Resume resume
    );

    List<InterviewQuestion> findByJobIdAndResumeId(
            Long jobId,
            Long resumeId
    );

    long countByJobIdAndResumeId(
            Long jobId,
            Long resumeId
    );
}