package com.airecruitment.job.controller;

import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.dto.UpdateJobRequest;
import com.airecruitment.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;


    // =========================================================
    // CREATE JOB
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(
            @Valid @RequestBody CreateJobRequest request) {

        return jobService.createJob(request);
    }


    // =========================================================
    // GET MY JOBS
    // =========================================================

    @GetMapping("/my")
    public List<JobResponse> getMyJobs(
            @RequestParam(
                    required = false
            ) JobStatus status) {

        if (status == null) {

            return jobService.getMyJobs();
        }


        return jobService
                .getMyJobsByStatus(status);
    }


    // =========================================================
    // GET SINGLE JOB
    // =========================================================

    @GetMapping("/{jobId}")
    public JobResponse getJob(
            @PathVariable Long jobId) {

        return jobService.getJob(jobId);
    }


    // =========================================================
    // UPDATE JOB
    // =========================================================

    @PutMapping("/{jobId}")
    public JobResponse updateJob(
            @PathVariable Long jobId,
            @Valid @RequestBody UpdateJobRequest request) {

        return jobService.updateJob(
                jobId,
                request
        );
    }


    // =========================================================
    // PUBLISH JOB
    // =========================================================

    @PatchMapping("/{jobId}/publish")
    public JobResponse publishJob(
            @PathVariable Long jobId) {

        return jobService.publishJob(
                jobId
        );
    }


    // =========================================================
    // CLOSE JOB
    // =========================================================

    @PatchMapping("/{jobId}/close")
    public JobResponse closeJob(
            @PathVariable Long jobId) {

        return jobService.closeJob(
                jobId
        );
    }


    // =========================================================
    // ARCHIVE JOB
    // =========================================================

    @PatchMapping("/{jobId}/archive")
    public JobResponse archiveJob(
            @PathVariable Long jobId) {

        return jobService.archiveJob(
                jobId
        );
    }
}