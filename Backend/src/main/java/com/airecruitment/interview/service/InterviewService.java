package com.airecruitment.interview.service;

import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.interview.dto.InterviewResultResponse;

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

    InterviewResultResponse getInterviewResult(
            Long candidateId,
            Long jobId
    );
}