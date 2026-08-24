package com.airecruitment.auth.dto;

import com.airecruitment.common.enums.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long userId;

    private String fullName;

    private String email;

    private UserRole role;

    private String token;

    private String message;

}