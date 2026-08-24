package com.airecruitment.interview.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InterviewQuestionsResponse {

    private Long jobId;

    private Long candidateId;

    private Long resumeId;

    private String jobTitle;

    private List<InterviewQuestion> questions;
}