package com.airecruitment.assessment.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "assessment_answers",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_assessment_question_candidate",
                        columnNames = {
                                "assessment_id",
                                "question_id",
                                "candidate_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAnswer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private AssessmentQuestion question;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column
    private Boolean correct;

    @Column
    private Double score;
}