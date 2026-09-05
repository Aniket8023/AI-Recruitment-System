package com.airecruitment.recruiter.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfileResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private String email;

    private Long companyId;

    private String companyName;

    private String designation;

    private String department;

    private String employeeId;

    private Integer experienceYears;

    private String linkedinUrl;
}