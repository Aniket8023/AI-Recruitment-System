package com.airecruitment.recruiter.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfileRequest {

    private Long companyId;

    private String designation;

    private String department;

    private String employeeId;

    private Integer experienceYears;

    private String linkedinUrl;
}