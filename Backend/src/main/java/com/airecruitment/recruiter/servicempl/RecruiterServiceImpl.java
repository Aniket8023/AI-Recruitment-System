package com.airecruitment.recruiter.serviceimpl;

import com.airecruitment.company.entity.Company;
import com.airecruitment.company.repository.CompanyRepository;
import com.airecruitment.common.enums.UserRole;
import com.airecruitment.recruiter.dto.RecruiterProfileRequest;
import com.airecruitment.recruiter.dto.RecruiterProfileResponse;
import com.airecruitment.recruiter.entity.RecruiterProfile;
import com.airecruitment.recruiter.repository.RecruiterProfileRepository;
import com.airecruitment.recruiter.service.RecruiterService;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterServiceImpl
        implements RecruiterService {

    private final RecruiterProfileRepository recruiterProfileRepository;

    private final UserRepository userRepository;

    private final CompanyRepository companyRepository;


    // =========================================================
    // CREATE RECRUITER PROFILE
    // =========================================================

    @Override
    @Transactional
    public RecruiterProfileResponse createProfile(
            Long userId,
            RecruiterProfileRequest request) {

        // 1. Find User

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // 2. Check Recruiter Role

        if (user.getRole() != UserRole.RECRUITER) {

            throw new RuntimeException(
                    "User is not a recruiter."
            );
        }


        // 3. Check Existing Profile

        if (recruiterProfileRepository
                .existsByUserId(userId)) {

            throw new RuntimeException(
                    "Recruiter profile already exists."
            );
        }


        // 4. Validate Company ID

        if (request.getCompanyId() == null) {

            throw new RuntimeException(
                    "Company ID is required."
            );
        }


        // 5. Find Company

        Company company =
                companyRepository.findById(
                                request.getCompanyId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company not found."
                                )
                        );


        // 6. Create Profile

        RecruiterProfile profile =
                RecruiterProfile.builder()
                        .user(user)
                        .company(company)
                        .designation(
                                request.getDesignation()
                        )
                        .department(
                                request.getDepartment()
                        )
                        .employeeId(
                                request.getEmployeeId()
                        )
                        .experienceYears(
                                request.getExperienceYears()
                        )
                        .linkedinUrl(
                                request.getLinkedinUrl()
                        )
                        .build();


        // 7. Save

        RecruiterProfile savedProfile =
                recruiterProfileRepository.save(
                        profile
                );


        // 8. Return Response

        return mapToResponse(savedProfile);
    }


    // =========================================================
    // GET RECRUITER PROFILE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileResponse getProfile(
            Long userId) {

        RecruiterProfile profile =
                recruiterProfileRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."
                                )
                        );

        return mapToResponse(profile);
    }


    // =========================================================
    // UPDATE RECRUITER PROFILE
    // =========================================================

    @Override
    @Transactional
    public RecruiterProfileResponse updateProfile(
            Long userId,
            RecruiterProfileRequest request) {

        RecruiterProfile profile =
                recruiterProfileRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Recruiter profile not found."
                                )
                        );


        // Update Company if provided

        if (request.getCompanyId() != null) {

            Company company =
                    companyRepository.findById(
                                    request.getCompanyId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Company not found."
                                    )
                            );

            profile.setCompany(company);
        }


        // Update fields

        if (request.getDesignation() != null) {

            profile.setDesignation(
                    request.getDesignation()
            );
        }

        if (request.getDepartment() != null) {

            profile.setDepartment(
                    request.getDepartment()
            );
        }

        if (request.getEmployeeId() != null) {

            profile.setEmployeeId(
                    request.getEmployeeId()
            );
        }

        if (request.getExperienceYears() != null) {

            profile.setExperienceYears(
                    request.getExperienceYears()
            );
        }

        if (request.getLinkedinUrl() != null) {

            profile.setLinkedinUrl(
                    request.getLinkedinUrl()
            );
        }


        // Save

        RecruiterProfile updatedProfile =
                recruiterProfileRepository.save(
                        profile
                );


        return mapToResponse(updatedProfile);
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private RecruiterProfileResponse mapToResponse(
            RecruiterProfile profile) {

        User user =
                profile.getUser();

        Company company =
                profile.getCompany();

        return RecruiterProfileResponse.builder()

                .id(profile.getId())

                .userId(
                        user.getId()
                )

                .fullName(
                        user.getFullName()
                )

                .email(
                        user.getEmail()
                )

                .companyId(
                        company.getId()
                )

                .companyName(
                        company.getCompanyName()
                )

                .designation(
                        profile.getDesignation()
                )

                .department(
                        profile.getDepartment()
                )

                .employeeId(
                        profile.getEmployeeId()
                )

                .experienceYears(
                        profile.getExperienceYears()
                )

                .linkedinUrl(
                        profile.getLinkedinUrl()
                )

                .build();
    }
}