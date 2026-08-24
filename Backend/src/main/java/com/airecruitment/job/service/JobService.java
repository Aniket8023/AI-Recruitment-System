package com.airecruitment.job.service;

import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;

public interface JobService {

    JobResponse createJob(CreateJobRequest request);
}