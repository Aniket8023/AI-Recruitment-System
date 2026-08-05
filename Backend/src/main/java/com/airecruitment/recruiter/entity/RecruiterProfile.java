package com.airecruitment.recruiter.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.company.entity.Company;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "recruiter_profiles")
public class RecruiterProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(unique = true, length = 50)
    private String employeeId;

    private Integer experienceYears;

    @Column(length = 200)
    private String linkedinUrl;
}