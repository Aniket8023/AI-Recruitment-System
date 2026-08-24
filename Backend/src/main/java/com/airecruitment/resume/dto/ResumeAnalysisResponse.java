package com.airecruitment.resume.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResumeAnalysisResponse {

    private Long resumeId;

    private Long candidateId;

    private String candidateName;

    private String experienceLevel;

    private List<String> technicalSkills;

    private List<String> softSkills;

    private List<String> education;

    private List<String> projects;

    private List<String> certifications;

    private String summary;
}