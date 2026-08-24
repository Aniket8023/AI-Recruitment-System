package com.airecruitment.resume.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "resume_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "resume_id",
            nullable = false,
            unique = true
    )
    private Resume resume;

    @Column(length = 150)
    private String candidateName;

    @Column(length = 100)
    private String experienceLevel;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_technical_skills",
            joinColumns = @JoinColumn(name = "resume_analysis_id")
    )
    @Column(name = "skill")
    private List<String> technicalSkills;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_soft_skills",
            joinColumns = @JoinColumn(name = "resume_analysis_id")
    )
    @Column(name = "skill")
    private List<String> softSkills;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_education",
            joinColumns = @JoinColumn(name = "resume_analysis_id")
    )
    @Column(name = "education")
    private List<String> education;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_projects",
            joinColumns = @JoinColumn(name = "resume_analysis_id")
    )
    @Column(name = "project")
    private List<String> projects;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_certifications",
            joinColumns = @JoinColumn(name = "resume_analysis_id")
    )
    @Column(name = "certification")
    private List<String> certifications;

    @Column(columnDefinition = "TEXT")
    private String summary;
}