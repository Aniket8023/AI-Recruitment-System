package com.airecruitment.recruiter.controller;

import com.airecruitment.recruiter.dto.RecruiterProfileRequest;
import com.airecruitment.recruiter.dto.RecruiterProfileResponse;
import com.airecruitment.recruiter.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recruiters")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;


    // =========================================================
    // CREATE PROFILE
    // =========================================================

    @PostMapping("/{userId}/profile")
    public ResponseEntity<RecruiterProfileResponse> createProfile(
            @PathVariable Long userId,
            @RequestBody RecruiterProfileRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        recruiterService.createProfile(
                                userId,
                                request
                        )
                );
    }


    // =========================================================
    // GET PROFILE
    // =========================================================

    @GetMapping("/{userId}/profile")
    public ResponseEntity<RecruiterProfileResponse> getProfile(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                recruiterService.getProfile(userId)
        );
    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    @PutMapping("/{userId}/profile")
    public ResponseEntity<RecruiterProfileResponse> updateProfile(
            @PathVariable Long userId,
            @RequestBody RecruiterProfileRequest request) {

        return ResponseEntity.ok(
                recruiterService.updateProfile(
                        userId,
                        request
                )
        );
    }
}