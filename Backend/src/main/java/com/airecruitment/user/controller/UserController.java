package com.airecruitment.user.controller;

import com.airecruitment.user.dto.ChangePasswordRequest;
import com.airecruitment.user.dto.UpdateUserProfileRequest;
import com.airecruitment.user.dto.UserProfileResponse;
import com.airecruitment.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // =============================================
    // GET MY PROFILE
    // =============================================

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {

        return ResponseEntity.ok(
                userService.getMyProfile()
        );
    }


    // =============================================
    // UPDATE MY PROFILE
    // =============================================

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateUserProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateMyProfile(request)
        );
    }


    // =============================================
    // CHANGE PASSWORD
    // =============================================

    @PatchMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.ok(
                "Password changed successfully."
        );
    }
}