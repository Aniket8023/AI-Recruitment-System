package com.airecruitment.application.service;

import com.airecruitment.application.dto.*;

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

    List<RecruiterApplicationResponse> getRecruiterApplications();

    List<RecruiterCandidateResponse> getRecruiterCandidates();

    RecruiterCandidateDetailsResponse getRecruiterCandidateDetails(
            Long applicationId
    );


}