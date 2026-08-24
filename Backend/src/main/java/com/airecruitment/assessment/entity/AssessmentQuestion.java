package com.airecruitment.assessment.entity;

import com.airecruitment.assessment.enums.AssessmentType;
import com.airecruitment.assessment.enums.QuestionType;
import com.airecruitment.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "assessment_questions",
        indexes = {
                @Index(name = "idx_question_assessment", columnList = "assessment_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentQuestion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QuestionType questionType;

    /*
     * For MCQ:
     * A|B|C|D
     */
    @Column(columnDefinition = "TEXT")
    private String options;

    /*
     * For MCQ we store the correct option.
     * Example: B
     */
    @Column(length = 500)
    private String correctAnswer;

    @Column(length = 30)
    private String difficulty;

    @Column(length = 100)
    private String topic;

    @Column(nullable = false)
    private Integer questionOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AssessmentType assessmentType;
}