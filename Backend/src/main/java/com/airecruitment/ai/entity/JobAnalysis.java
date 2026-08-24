package com.airecruitment.ai.entity;

import com.airecruitment.job.entity.Job;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "job_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @Column(nullable = false, length = 150)
    private String jobTitle;

    @Column(length = 100)
    private String experienceLevel;

    @ElementCollection
    @CollectionTable(
            name = "job_analysis_technical_skills",
            joinColumns = @JoinColumn(name = "job_analysis_id")
    )
    @Column(name = "skill")
    private List<String> technicalSkills;

    @ElementCollection
    @CollectionTable(
            name = "job_analysis_preferred_skills",
            joinColumns = @JoinColumn(name = "job_analysis_id")
    )
    @Column(name = "skill")
    private List<String> preferredSkills;

    @ElementCollection
    @CollectionTable(
            name = "job_analysis_soft_skills",
            joinColumns = @JoinColumn(name = "job_analysis_id")
    )
    @Column(name = "skill")
    private List<String> softSkills;

    @ElementCollection
    @CollectionTable(
            name = "job_analysis_core_competencies",
            joinColumns = @JoinColumn(name = "job_analysis_id")
    )
    @Column(name = "competency")
    private List<String> coreCompetencies;

    @Column(length = 50)
    private String difficultyLevel;
}