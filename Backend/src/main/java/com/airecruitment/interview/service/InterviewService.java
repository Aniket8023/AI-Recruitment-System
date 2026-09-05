package com.airecruitment.interview.service;

import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.interview.dto.InterviewResultResponse;

import java.util.List;

public interface InterviewService {

    InterviewQuestionsResponse generateQuestions(
            Long jobId,
            Long candidateId,
            Long resumeId
    );

    InterviewEvaluationResponse submitAnswer(
            Long candidateId,
            Long questionId,
            String answer
    );

    List<InterviewQuestionResponse> getQuestions(
            Long candidateId,
            Long jobId,
            Long resumeId
    );

    InterviewResultResponse getInterviewResult(
            Long candidateId,
            Long jobId
    );
}