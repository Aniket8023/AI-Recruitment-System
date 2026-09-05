package com.airecruitment.application.service;

import com.airecruitment.application.dto.ApplyJobRequest;
import com.airecruitment.application.dto.JobApplicationResponse;

import java.util.List;

public interface JobApplicationService {

    JobApplicationResponse applyForJob(
            Long jobId,
            ApplyJobRequest request
    );


    List<JobApplicationResponse> getMyApplications();


    JobApplicationResponse getApplication(
            Long applicationId
    );
}