package com.airecruitment.match.service;

import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.match.dto.*;

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

    CandidateEvaluationResponse getCandidateEvaluation(
            Long jobId,
            Long candidateId,
            Long resumeId
    );
}