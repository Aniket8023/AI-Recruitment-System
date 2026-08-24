package com.airecruitment.assessment.entity;

import com.airecruitment.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assessment_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResult extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "assessment_id",
            nullable = false,
            unique = true
    )
    private Assessment assessment;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer attemptedQuestions;

    @Column(nullable = false)
    private Integer correctAnswers;

    @Column(nullable = false)
    private Double aptitudeScore;

    @Column(nullable = false)
    private Double technicalScore;

    @Column(nullable = false)
    private Double codingScore;

    @Column(nullable = false)
    private Double overallScore;

    @Column(nullable = false)
    private Boolean passed;

    @Column(length = 100)
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}