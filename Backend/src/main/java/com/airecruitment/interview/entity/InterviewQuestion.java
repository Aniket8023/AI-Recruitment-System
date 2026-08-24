package com.airecruitment.interview.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.job.entity.Job;
import com.airecruitment.resume.entity.Resume;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "interview_questions",
        indexes = {
                @Index(name = "idx_question_job", columnList = "job_id"),
                @Index(name = "idx_question_resume", columnList = "resume_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(nullable = false, length = 20)
    private String difficulty;
}