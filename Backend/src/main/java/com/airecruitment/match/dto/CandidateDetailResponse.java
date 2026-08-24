package com.airecruitment.match.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CandidateDetailResponse {

    private Long candidateId;

    private Long resumeId;

    private String candidateName;

    private String email;

    private String jobTitle;

    private Double matchScore;

    private String recommendation;

    private String status;

    private String matchedTechnicalSkills;

    private String missingTechnicalSkills;

    private String matchedSoftSkills;

    private String strengths;

    private String skillGaps;

    private String explanation;
}