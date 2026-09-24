package com.airecruitment.resume.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResumeResponse {

    private Long resumeId;
    private Long candidateId;
    private String fileName;
    private String fileType;
}