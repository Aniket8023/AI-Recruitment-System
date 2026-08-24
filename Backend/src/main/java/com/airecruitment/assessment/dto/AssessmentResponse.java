package com.airecruitment.assessment.dto;

import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.assessment.enums.AssessmentType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResponse {

    private Long assessmentId;

    private Long candidateId;

    private Long jobId;

    private Long resumeId;

    private AssessmentType type;

    private AssessmentStatus status;

    private Integer totalQuestions;

    private Integer durationMinutes;
}