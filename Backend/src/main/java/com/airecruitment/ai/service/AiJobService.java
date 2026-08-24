package com.airecruitment.ai.service;

import com.airecruitment.ai.dto.JobAnalysisResponse;

public interface AiJobService {

    JobAnalysisResponse analyzeJob(Long jobId);

    JobAnalysisResponse getJobAnalysis(Long jobId);
}