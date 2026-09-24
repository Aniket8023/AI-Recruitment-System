package com.airecruitment.recruiter.controller;

import com.airecruitment.recruiter.dto.RecruiterDashboardResponse;
import com.airecruitment.recruiter.service.RecruiterDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter")
@RequiredArgsConstructor
public class RecruiterDashboardController {

    private final RecruiterDashboardService
            recruiterDashboardService;


    // =========================================================
    // RECRUITER DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public RecruiterDashboardResponse getDashboard() {

        return recruiterDashboardService
                .getDashboard();
    }
}