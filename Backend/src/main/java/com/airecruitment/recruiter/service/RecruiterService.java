package com.airecruitment.recruiter.service;

import com.airecruitment.recruiter.dto.RecruiterProfileRequest;
import com.airecruitment.recruiter.dto.RecruiterProfileResponse;

public interface RecruiterService {

    RecruiterProfileResponse createProfile(
            Long userId,
            RecruiterProfileRequest request
    );

    RecruiterProfileResponse getProfile(
            Long userId
    );

    RecruiterProfileResponse updateProfile(
            Long userId,
            RecruiterProfileRequest request
    );
}