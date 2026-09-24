package com.airecruitment.application.dto;


import com.airecruitment.common.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterCandidateDetailsResponse {

    private Long applicationId;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;

    private Long jobId;
    private String jobTitle;

    private Long resumeId;

    private ApplicationStatus applicationStatus;

    /* ================= AI MATCH ================= */

    private Double matchScore;
    private String recommendation;

    private String matchedTechnicalSkills;
    private String missingTechnicalSkills;
    private String matchedSoftSkills;
    private String strengths;
    private String skillGaps;
    private String matchExplanation;

    /* ================= ASSESSMENT ================= */

    private Long assessmentId;
    private String assessmentStatus;
    private Integer assessmentTotalQuestions;
    private Integer assessmentCorrectAnswers;
    private Double assessmentScore;
    private Boolean assessmentPassed;

    /* ================= INTERVIEW ================= */

    private String interviewStatus;
    private Integer interviewTotalQuestions;
    private Integer interviewAnsweredQuestions;
    private Double interviewScore;
    private String interviewRecommendation;

    private Boolean interviewIntegrityViolation;
    private Integer interviewViolationCount;
    private String interviewTerminationReason;
}