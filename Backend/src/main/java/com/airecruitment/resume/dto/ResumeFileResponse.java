package com.airecruitment.resume.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResumeFileResponse {

    private byte[] fileData;
    private String fileName;
    private String fileType;
}