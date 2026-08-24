package com.airecruitment.ai.repository;

import com.airecruitment.ai.entity.JobAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobAnalysisRepository extends JpaRepository<JobAnalysis, Long> {

    Optional<JobAnalysis> findByJobId(Long jobId);
}