package com.airecruitment.interview.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.job.entity.Job;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "interview_results",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_candidate_job_interview",
                        columnNames = {"candidate_id", "job_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResult extends BaseEntity {

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


    @Column(nullable = false)
    private Integer totalQuestions;


    @Column(nullable = false)
    private Integer answeredQuestions;


    @Column(nullable = false)
    private Double averageScore;


    @Column(nullable = false)
    private Double overallScore;


    @Column(nullable = false)
    private Double technicalScore;


    @Column(nullable = false)
    private Double hrScore;


    @Column(nullable = false)
    private Double skillGapScore;


    @Column(length = 50, nullable = false)
    private String recommendation;


    @Column(columnDefinition = "TEXT")
    private String summary;
}