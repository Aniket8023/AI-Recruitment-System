package com.airecruitment.resume.repository;

import com.airecruitment.resume.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

    Optional<ResumeAnalysis> findByResumeId(Long resumeId);
}