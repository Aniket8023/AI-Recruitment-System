package com.airecruitment.job.service;

import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.dto.UpdateJobRequest;

import java.util.List;

public interface JobService {

    JobResponse createJob(
            CreateJobRequest request
    );

    JobResponse getJob(
            Long jobId
    );

    List<JobResponse> getMyJobs();

    List<JobResponse> getMyJobsByStatus(
            JobStatus status
    );

    JobResponse updateJob(
            Long jobId,
            UpdateJobRequest request
    );

    JobResponse publishJob(
            Long jobId
    );

    JobResponse closeJob(
            Long jobId
    );

    JobResponse archiveJob(
            Long jobId
    );
}