package com.airecruitment.resume.service;

import com.airecruitment.resume.dto.ResumeAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    String uploadResume(Long candidateId, MultipartFile file);

    ResumeAnalysisResponse analyzeResume(Long resumeId);

    ResumeAnalysisResponse getResumeAnalysis(Long resumeId);
}