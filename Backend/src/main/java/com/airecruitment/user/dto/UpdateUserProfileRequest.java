package com.airecruitment.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Pattern(
            regexp = "^$|^[0-9]{10,15}$",
            message = "Phone number must contain 10 to 15 digits"
    )
    private String phone;

    @Size(max = 255, message = "Profile image URL is too long")
    private String profileImageUrl;
}