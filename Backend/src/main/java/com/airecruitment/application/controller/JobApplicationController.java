package com.airecruitment.application.controller;

import com.airecruitment.application.dto.ApplyJobRequest;
import com.airecruitment.application.dto.JobApplicationResponse;
import com.airecruitment.application.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;


    // =========================================================
    // APPLY FOR JOB
    // =========================================================

    @PostMapping("/jobs/{jobId}")
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse applyForJob(
            @PathVariable Long jobId,
            @Valid @RequestBody ApplyJobRequest request) {

        return jobApplicationService.applyForJob(
                jobId,
                request
        );
    }


    // =========================================================
    // GET MY APPLICATIONS
    // =========================================================

    @GetMapping("/my")
    public List<JobApplicationResponse> getMyApplications() {

        return jobApplicationService
                .getMyApplications();
    }


    // =========================================================
    // GET APPLICATION BY ID
    // =========================================================

    @GetMapping("/{applicationId}")
    public JobApplicationResponse getApplication(
            @PathVariable Long applicationId) {

        return jobApplicationService
                .getApplication(applicationId);
    }
}