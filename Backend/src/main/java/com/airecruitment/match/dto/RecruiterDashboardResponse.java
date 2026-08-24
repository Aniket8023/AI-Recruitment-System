package com.airecruitment.match.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RecruiterDashboardResponse {

    private Long jobId;

    private String jobTitle;

    private long totalCandidates;

    private long pendingCandidates;

    private long shortlistedCandidates;

    private long rejectedCandidates;

    private double averageMatchScore;

    private long strongMatches;
}