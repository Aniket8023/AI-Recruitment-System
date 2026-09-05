package com.airecruitment.company.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {

    private Long id;

    private String companyName;

    private String companyEmail;

    private String companyWebsite;

    private String industry;

    private String companySize;

    private String description;

    private String address;

    private String city;

    private String state;

    private String country;

    private String logoUrl;

    private Boolean verified;
}