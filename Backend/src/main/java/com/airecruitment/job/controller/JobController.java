package com.airecruitment.job.controller;

import com.airecruitment.job.dto.CreateJobRequest;
import com.airecruitment.job.dto.JobResponse;
import com.airecruitment.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(
            @Valid @RequestBody CreateJobRequest request) {

        return jobService.createJob(request);
    }
}