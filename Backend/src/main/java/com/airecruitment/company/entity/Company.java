package com.airecruitment.company.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "companies",
        indexes = {
                @Index(
                        name = "idx_company_email",
                        columnList = "companyEmail"
                ),
                @Index(
                        name = "idx_company_name",
                        columnList = "companyName"
                )
        }
)
public class Company extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "recruiter_id",
            nullable = false,
            unique = true
    )
    private User recruiter;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, unique = true, length = 150)
    private String companyEmail;

    @Column(length = 200)
    private String companyWebsite;

    @Column(length = 100)
    private String industry;

    @Column(length = 50)
    private String companySize;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    private String logoUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;
}