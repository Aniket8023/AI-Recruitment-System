package com.airecruitment.company.service;

import com.airecruitment.company.dto.CompanyRequest;
import com.airecruitment.company.dto.CompanyResponse;

public interface CompanyService {

    CompanyResponse createCompany(CompanyRequest request);

    CompanyResponse getCompany(Long companyId);
}