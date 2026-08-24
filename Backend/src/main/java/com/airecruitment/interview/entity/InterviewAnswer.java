package com.airecruitment.interview.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "interview_answers",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_candidate_question",
                        columnNames = {"candidate_id", "question_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column
    private Double score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(length = 30)
    private String evaluationStatus;
}