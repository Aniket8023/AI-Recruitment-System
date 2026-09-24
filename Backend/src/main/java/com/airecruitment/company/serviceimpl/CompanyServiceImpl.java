package com.airecruitment.company.serviceimpl;

import com.airecruitment.company.dto.CompanyRequest;
import com.airecruitment.company.dto.CompanyResponse;
import com.airecruitment.company.entity.Company;
import com.airecruitment.company.repository.CompanyRepository;
import com.airecruitment.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.airecruitment.user.entity.User;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    private final UserRepository userRepository;

    @Override
    @Transactional
    public CompanyResponse createCompany(
            CompanyRequest request) {

        User recruiter = getAuthenticatedRecruiter();

        if (companyRepository.existsByRecruiter(recruiter)) {

            throw new RuntimeException(
                    "Company profile already exists."
            );
        }

        if (companyRepository.existsByCompanyEmail(
                request.getCompanyEmail())) {

            throw new RuntimeException(
                    "Company email already exists."
            );
        }

        Company company = Company.builder()

                .recruiter(recruiter)

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

    private User getAuthenticatedRecruiter() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("Authenticated user not found");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            throw new RuntimeException("Authenticated user not found");
        }

        if (user.getRole() != UserRole.RECRUITER &&
                user.getRole() != UserRole.COMPANY_ADMIN) {

            throw new RuntimeException(
                    "Only recruiter or company admin can manage company profile"
            );
        }

        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getMyCompany() {

        User recruiter = getAuthenticatedRecruiter();

        Company company =
                companyRepository.findByRecruiter(recruiter)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company profile not found."
                                )
                        );

        return mapToResponse(company);
    }

    @Override
    @Transactional
    public CompanyResponse updateMyCompany(
            CompanyRequest request) {

        User recruiter = getAuthenticatedRecruiter();

        Company company =
                companyRepository.findByRecruiter(recruiter)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company profile not found."
                                )
                        );

        company.setCompanyName(
                request.getCompanyName()
        );

        company.setCompanyEmail(
                request.getCompanyEmail()
        );

        company.setCompanyWebsite(
                request.getCompanyWebsite()
        );

        company.setIndustry(
                request.getIndustry()
        );

        company.setCompanySize(
                request.getCompanySize()
        );

        company.setDescription(
                request.getDescription()
        );

        company.setAddress(
                request.getAddress()
        );

        company.setCity(
                request.getCity()
        );

        company.setState(
                request.getState()
        );

        company.setCountry(
                request.getCountry()
        );

        company.setLogoUrl(
                request.getLogoUrl()
        );

        Company updated =
                companyRepository.save(company);

        return mapToResponse(updated);
    }
}