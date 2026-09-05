package com.airecruitment.company.serviceimpl;

import com.airecruitment.company.dto.CompanyRequest;
import com.airecruitment.company.dto.CompanyResponse;
import com.airecruitment.company.entity.Company;
import com.airecruitment.company.repository.CompanyRepository;
import com.airecruitment.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    public CompanyResponse createCompany(
            CompanyRequest request) {

        if (companyRepository.existsByCompanyEmail(
                request.getCompanyEmail())) {

            throw new RuntimeException(
                    "Company email already exists."
            );
        }

        Company company =
                Company.builder()
                        .companyName(
                                request.getCompanyName()
                        )
                        .companyEmail(
                                request.getCompanyEmail()
                        )
                        .companyWebsite(
                                request.getCompanyWebsite()
                        )
                        .industry(
                                request.getIndustry()
                        )
                        .companySize(
                                request.getCompanySize()
                        )
                        .description(
                                request.getDescription()
                        )
                        .address(
                                request.getAddress()
                        )
                        .city(
                                request.getCity()
                        )
                        .state(
                                request.getState()
                        )
                        .country(
                                request.getCountry()
                        )
                        .logoUrl(
                                request.getLogoUrl()
                        )
                        .verified(false)
                        .build();

        Company savedCompany =
                companyRepository.save(company);

        return mapToResponse(savedCompany);
    }

    @Override
    public CompanyResponse getCompany(
            Long companyId) {

        Company company =
                companyRepository.findById(companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company not found."
                                )
                        );

        return mapToResponse(company);
    }

    private CompanyResponse mapToResponse(
            Company company) {

        return CompanyResponse.builder()
                .id(company.getId())
                .companyName(
                        company.getCompanyName()
                )
                .companyEmail(
                        company.getCompanyEmail()
                )
                .companyWebsite(
                        company.getCompanyWebsite()
                )
                .industry(
                        company.getIndustry()
                )
                .companySize(
                        company.getCompanySize()
                )
                .description(
                        company.getDescription()
                )
                .address(
                        company.getAddress()
                )
                .city(
                        company.getCity()
                )
                .state(
                        company.getState()
                )
                .country(
                        company.getCountry()
                )
                .logoUrl(
                        company.getLogoUrl()
                )
                .verified(
                        company.getVerified()
                )
                .build();
    }
}