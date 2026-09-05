package com.airecruitment.match.controller;

import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.match.dto.*;
import com.airecruitment.match.service.JobMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
public class JobMatchingController {

    private final JobMatchingService jobMatchingService;

    @PostMapping("/jobs/{jobId}/resumes/{resumeId}")
    public ResponseEntity<JobMatchResponse> matchJobWithResume(
            @PathVariable Long jobId,
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                jobMatchingService.matchJobWithResume(
                        jobId,
                        resumeId
                )
        );
    }

//    @GetMapping("/jobs/{jobId}/candidates")
//    public List<CandidateRankingResponse> getRankedCandidates(
//            @PathVariable Long jobId) {
//
//        return jobMatchingService.getRankedCandidates(jobId);
//    }

    @GetMapping("/jobs/{jobId}/candidates")
    public List<CandidateRankingResponse> getCandidates(
            @PathVariable Long jobId,
            @RequestParam(required = false) MatchStatus status) {

        if (status == null) {

            return jobMatchingService
                    .getRankedCandidates(jobId);
        }

        return jobMatchingService
                .getCandidatesByStatus(jobId, status);
    }

    @GetMapping("/jobs/{jobId}/candidates/{resumeId}")
    public CandidateDetailResponse getCandidateDetails(
            @PathVariable Long jobId,
            @PathVariable Long resumeId) {

        return jobMatchingService.getCandidateDetails(
                jobId,
                resumeId
        );
    }

    @PatchMapping("/jobs/{jobId}/candidates/{resumeId}/shortlist")
    public ResponseEntity<String> shortlistCandidate(
            @PathVariable Long jobId,
            @PathVariable Long resumeId) {

        jobMatchingService.shortlistCandidate(
                jobId,
                resumeId
        );

        return ResponseEntity.ok(
                "Candidate shortlisted successfully."
        );
    }

    @PatchMapping("/jobs/{jobId}/candidates/{resumeId}/reject")
    public ResponseEntity<String> rejectCandidate(
            @PathVariable Long jobId,
            @PathVariable Long resumeId) {

        jobMatchingService.rejectCandidate(
                jobId,
                resumeId
        );

        return ResponseEntity.ok(
                "Candidate rejected successfully."
        );
    }

    @GetMapping("/jobs/{jobId}/dashboard")
    public RecruiterDashboardResponse getDashboardSummary(
            @PathVariable Long jobId) {

        return jobMatchingService
                .getDashboardSummary(jobId);
    }

    @GetMapping(
            "/jobs/{jobId}/candidates/{candidateId}/resumes/{resumeId}/evaluation"
    )
    public CandidateEvaluationResponse getCandidateEvaluation(
            @PathVariable Long jobId,
            @PathVariable Long candidateId,
            @PathVariable Long resumeId) {

        return jobMatchingService.getCandidateEvaluation(
                jobId,
                candidateId,
                resumeId
        );
    }
}