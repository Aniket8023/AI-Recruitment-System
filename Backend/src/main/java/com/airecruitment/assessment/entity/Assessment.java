package com.airecruitment.assessment.entity;

import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.assessment.enums.AssessmentType;
import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "assessments",
        indexes = {
                @Index(name = "idx_assessment_candidate", columnList = "candidate_id"),
                @Index(name = "idx_assessment_job", columnList = "job_id"),
                @Index(name = "idx_assessment_resume", columnList = "resume_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AssessmentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private AssessmentStatus status = AssessmentStatus.CREATED;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column
    private Integer durationMinutes;
}