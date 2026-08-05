package com.airecruitment.company.entity;

import com.airecruitment.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
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
                @Index(name = "idx_company_email", columnList = "companyEmail"),
                @Index(name = "idx_company_name", columnList = "companyName")
        }
)
public class Company extends BaseEntity {

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
    private Boolean verified = false;

}