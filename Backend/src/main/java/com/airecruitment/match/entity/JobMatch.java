package com.airecruitment.match.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.common.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "job_matches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_job_resume",
                        columnNames = {"job_id", "resume_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatch extends BaseEntity {

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

    @Column(
            name = "match_score",
            nullable = false
    )
    private Double matchScore;

    @Column(length = 50)
    private String recommendation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MatchStatus status = MatchStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String matchedTechnicalSkills;

    @Column(columnDefinition = "TEXT")
    private String missingTechnicalSkills;

    @Column(columnDefinition = "TEXT")
    private String matchedSoftSkills;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String skillGaps;

    @Column(columnDefinition = "TEXT")
    private String explanation;


}