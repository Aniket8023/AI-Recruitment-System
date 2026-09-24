package com.airecruitment.recruiter.dto;

import com.airecruitment.application.dto.RecruiterApplicationResponse;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.match.dto.RecruiterShortlistedResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RecruiterDashboardResponse {

    private long totalJobs;

    private long activeJobs;

    private long totalApplications;

    private long shortlistedCandidates;

    private List<JobResponse> recentJobs;

    private List<RecruiterApplicationResponse>
            recentApplications;

    private List<RecruiterShortlistedResponse>
            recentShortlistedCandidates;
}