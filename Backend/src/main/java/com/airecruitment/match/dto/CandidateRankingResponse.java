package com.airecruitment.match.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CandidateRankingResponse {

    private Integer rank;

    private Long candidateId;

    private Long resumeId;

    private String candidateName;

    private String email;

    private Double matchScore;

    private String recommendation;

    private String explanation;
}