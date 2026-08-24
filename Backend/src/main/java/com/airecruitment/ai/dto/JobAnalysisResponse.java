package com.airecruitment.ai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobAnalysisResponse {

    private Long jobId;

    private String jobTitle;

    private String experienceLevel;

    private List<String> technicalSkills;

    private List<String> preferredSkills;

    private List<String> softSkills;

    private List<String> coreCompetencies;

    private String difficultyLevel;
}