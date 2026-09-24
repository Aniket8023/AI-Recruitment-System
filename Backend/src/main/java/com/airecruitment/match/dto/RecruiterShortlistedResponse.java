package com.airecruitment.match.dto;

import com.airecruitment.common.enums.MatchStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterShortlistedResponse {

    private Long jobMatchId;

    private Long applicationId;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long jobId;
    private Long resumeId;

    private String jobTitle;

    private Double matchScore;

    private String recommendation;

    private MatchStatus status;
}