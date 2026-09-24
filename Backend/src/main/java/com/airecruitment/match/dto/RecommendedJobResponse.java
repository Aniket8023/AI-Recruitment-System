package com.airecruitment.match.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedJobResponse {

    private Long jobId;

    private String jobTitle;

    private String location;

    private String workMode;

    private Double matchScore;

    private String recommendation;

    private String explanation;
}