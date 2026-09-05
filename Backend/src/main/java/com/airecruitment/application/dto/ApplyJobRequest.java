package com.airecruitment.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyJobRequest {

    @NotNull(message = "Resume ID is required")
    private Long resumeId;
}