package com.airecruitment.interview.controller;

import com.airecruitment.interview.dto.InterviewAnswerRequest;
import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.interview.dto.InterviewResultResponse;
import com.airecruitment.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping(
            "/jobs/{jobId}/candidates/{candidateId}/resumes/{resumeId}/questions"
    )
    public InterviewQuestionsResponse generateQuestions(
            @PathVariable Long jobId,
            @PathVariable Long candidateId,
            @PathVariable Long resumeId) {

        return interviewService.generateQuestions(
                jobId,
                candidateId,
                resumeId
        );
    }

    @PostMapping(
            "/candidates/{candidateId}/questions/{questionId}/answer"
    )
    public InterviewEvaluationResponse submitAnswer(
            @PathVariable Long candidateId,
            @PathVariable Long questionId,
            @RequestBody InterviewAnswerRequest request) {

        return interviewService.submitAnswer(
                candidateId,
                questionId,
                request.getAnswer()
        );
    }

    @GetMapping(
            "/candidates/{candidateId}/jobs/{jobId}/result"
    )
    public InterviewResultResponse getInterviewResult(
            @PathVariable Long candidateId,
            @PathVariable Long jobId) {

        return interviewService.getInterviewResult(
                candidateId,
                jobId
        );
    }
}