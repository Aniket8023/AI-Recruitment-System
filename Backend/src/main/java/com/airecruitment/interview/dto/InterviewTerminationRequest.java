package com.airecruitment.interview.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewTerminationRequest {

    private Integer violationCount;

    private String reason;
}