package com.airecruitment.match.service;

import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.match.dto.CandidateDetailResponse;
import com.airecruitment.match.dto.CandidateRankingResponse;
import com.airecruitment.match.dto.JobMatchResponse;
import com.airecruitment.match.dto.RecruiterDashboardResponse;

import java.util.List;

public interface JobMatchingService {

    JobMatchResponse matchJobWithResume(
            Long jobId,
            Long resumeId
    );

    List<CandidateRankingResponse> getRankedCandidates(Long jobId);

    CandidateDetailResponse getCandidateDetails(
            Long jobId,
            Long resumeId
    );

    List<CandidateRankingResponse> getCandidatesByStatus(
            Long jobId,
            MatchStatus status
    );

    void shortlistCandidate(
            Long jobId,
            Long resumeId
    );

    void rejectCandidate(
            Long jobId,
            Long resumeId
    );

    RecruiterDashboardResponse getDashboardSummary(
            Long jobId
    );
}