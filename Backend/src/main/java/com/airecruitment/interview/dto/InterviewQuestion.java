package com.airecruitment.interview.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InterviewQuestion {

    private String question;

    private String type;

    private String difficulty;
}