package com.airecruitment.company.controller;

import com.airecruitment.company.dto.CompanyRequest;
import com.airecruitment.company.dto.CompanyResponse;
import com.airecruitment.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @RequestBody CompanyRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        companyService.createCompany(request)
                );
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyResponse> getCompany(
            @PathVariable Long companyId) {

        return ResponseEntity.ok(
                companyService.getCompany(companyId)
        );
    }
}