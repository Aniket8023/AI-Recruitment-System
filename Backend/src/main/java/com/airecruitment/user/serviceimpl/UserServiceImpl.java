package com.airecruitment.user.serviceimpl;

import com.airecruitment.common.enums.UserRole;
import com.airecruitment.user.dto.ChangePasswordRequest;
import com.airecruitment.user.dto.UpdateUserProfileRequest;
import com.airecruitment.user.dto.UserProfileResponse;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import com.airecruitment.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    // =============================================
    // GET MY PROFILE
    // =============================================

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {

        User user = getAuthenticatedUser();

        return mapToResponse(user);
    }


    // =============================================
    // UPDATE MY PROFILE
    // =============================================

    @Override
    @Transactional
    public UserProfileResponse updateMyProfile(
            UpdateUserProfileRequest request) {

        User user = getAuthenticatedUser();

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setProfileImageUrl(
                request.getProfileImageUrl()
        );

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }


    // =============================================
    // CHANGE PASSWORD
    // =============================================

    @Override
    @Transactional
    public void changePassword(
            ChangePasswordRequest request) {

        User user = getAuthenticatedUser();

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword().equals(
                request.getConfirmPassword()
        )) {

            throw new RuntimeException(
                    "New password and confirm password do not match"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }


    // =============================================
    // GET AUTHENTICATED USER
    // =============================================

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        Object principal =
                authentication.getPrincipal();

        if (!(principal instanceof User user)) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        return user;
    }


    // =============================================
    // MAP USER → RESPONSE
    // =============================================

    private UserProfileResponse mapToResponse(
            User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerified())
                .profileImageUrl(
                        user.getProfileImageUrl()
                )
                .lastLogin(user.getLastLogin())
                .build();
    }
}