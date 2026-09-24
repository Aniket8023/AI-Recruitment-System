package com.airecruitment.user.service;

import com.airecruitment.user.dto.UserProfileResponse;
import com.airecruitment.user.dto.UpdateUserProfileRequest;
import com.airecruitment.user.dto.ChangePasswordRequest;

public interface UserService {

    UserProfileResponse getMyProfile();

    UserProfileResponse updateMyProfile(
            UpdateUserProfileRequest request
    );

    void changePassword(
            ChangePasswordRequest request
    );
}