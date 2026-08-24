package com.airecruitment.job.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.common.enums.JobStatus;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "jobs",
        indexes = {
                @Index(name = "idx_job_title", columnList = "title"),
                @Index(name = "idx_job_status", columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000)
    private String requiredSkills;

    @Column(length = 1000)
    private String preferredSkills;

    @Column(length = 100)
    private String experienceRequired;

    @Column(length = 150)
    private String location;

    @Column(length = 50)
    private String employmentType;

    @Column(length = 50)
    private String workMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;
}