package com.airecruitment.resume.entity;

import com.airecruitment.common.entity.BaseEntity;
import com.airecruitment.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, length = 100)
    private String fileType;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;
}