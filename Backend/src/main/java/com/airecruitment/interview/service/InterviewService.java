package com.airecruitment.interview.service;

import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.interview.dto.InterviewResultResponse;

import java.util.List;
import com.airecruitment.interview.dto.InterviewListResponse;
import org.springframework.web.multipart.MultipartFile;

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

    InterviewEvaluationResponse submitVoiceAnswer(
            Long candidateId,
            Long questionId,
            MultipartFile audio
    );

    InterviewResultResponse terminateInterview(
            Long candidateId,
            Long jobId,
            Integer violationCount,
            String reason
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

    List<InterviewListResponse> getMyInterviews(Long candidateId);
}