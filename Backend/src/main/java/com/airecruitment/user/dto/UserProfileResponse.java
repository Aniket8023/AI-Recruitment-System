package com.airecruitment.user.dto;

import com.airecruitment.common.enums.AccountStatus;
import com.airecruitment.common.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private UserRole role;

    private AccountStatus status;

    private Boolean emailVerified;

    private String profileImageUrl;

    private LocalDateTime lastLogin;
}