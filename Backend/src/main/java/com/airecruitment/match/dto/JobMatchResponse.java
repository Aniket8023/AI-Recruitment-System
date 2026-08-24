package com.airecruitment.match.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JobMatchResponse {

    private Long jobId;

    private Long resumeId;

    private Long candidateId;

    private String jobTitle;

    private double matchScore;

    private String recommendation;

    private List<String> matchedTechnicalSkills;

    private List<String> missingTechnicalSkills;

    private List<String> matchedSoftSkills;

    private List<String> strengths;

    private List<String> skillGaps;

    private String explanation;
}