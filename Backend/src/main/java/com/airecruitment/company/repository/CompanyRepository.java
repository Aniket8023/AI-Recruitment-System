package com.airecruitment.company.repository;

import com.airecruitment.company.entity.Company;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByCompanyEmail(String companyEmail);

    boolean existsByCompanyEmail(String companyEmail);

    Optional<Company> findByRecruiter(User recruiter);

    boolean existsByRecruiter(User recruiter);
}