package com.airecruitment.recruiter.repository;

import com.airecruitment.recruiter.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository
        extends JpaRepository<RecruiterProfile, Long> {

    Optional<RecruiterProfile> findByUserId(Long userId);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUserId(Long userId);
}