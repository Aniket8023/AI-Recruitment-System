package com.airecruitment.ai.controller;

import com.airecruitment.ai.dto.JobAnalysisResponse;
import com.airecruitment.ai.service.AiJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai/jobs")
@RequiredArgsConstructor
public class AiJobController {

    private final AiJobService aiJobService;

    @PostMapping("/{jobId}/analyze")
    public JobAnalysisResponse analyzeJob(
            @PathVariable Long jobId) {

        return aiJobService.analyzeJob(jobId);
    }

    @GetMapping("/{jobId}/analysis")
    public JobAnalysisResponse getJobAnalysis(
            @PathVariable Long jobId) {

        return aiJobService.getJobAnalysis(jobId);
    }
}