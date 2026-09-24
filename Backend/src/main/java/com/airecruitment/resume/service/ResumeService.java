package com.airecruitment.resume.service;

import com.airecruitment.resume.dto.ResumeAnalysisResponse;
import com.airecruitment.resume.dto.ResumeFileResponse;
import com.airecruitment.resume.dto.ResumeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {

    String uploadResume(Long candidateId, MultipartFile file);

    ResumeAnalysisResponse analyzeResume(Long resumeId);

    ResumeAnalysisResponse getResumeAnalysis(Long resumeId);

    List<ResumeResponse> getMyResumes(Long candidateId);

    ResumeFileResponse getResumeFile(Long resumeId);
}