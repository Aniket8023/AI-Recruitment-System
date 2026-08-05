package com.airecruitment.recruiter.repository;

import com.airecruitment.recruiter.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruiterProfileRepository
        extends JpaRepository<RecruiterProfile, Long> {
}