package com.airecruitment.application.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.common.enums.ApplicationStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_candidate_job",
                        columnNames = {
                                "candidate_id",
                                "job_id"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_application_candidate",
                        columnList = "candidate_id"
                ),
                @Index(
                        name = "idx_application_job",
                        columnList = "job_id"
                ),
                @Index(
                        name = "idx_application_status",
                        columnList = "status"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "candidate_id",
            nullable = false
    )
    private User candidate;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "job_id",
            nullable = false
    )
    private Job job;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "resume_id",
            nullable = false
    )
    private Resume resume;


    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 50
    )
    @Builder.Default
    private ApplicationStatus status =
            ApplicationStatus.APPLIED;
}