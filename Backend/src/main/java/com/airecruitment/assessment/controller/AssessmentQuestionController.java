package com.airecruitment.assessment.controller;

import com.airecruitment.assessment.dto.AssessmentQuestionResponse;
import com.airecruitment.assessment.entity.AssessmentQuestion;
import com.airecruitment.assessment.service.AssessmentQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentQuestionController {

    private final AssessmentQuestionService assessmentQuestionService;


    @PostMapping("/{assessmentId}/generate-questions")
    public List<AssessmentQuestion> generateQuestions(
            @PathVariable Long assessmentId
    ) {

        return assessmentQuestionService
                .generateQuestions(assessmentId);
    }


    @GetMapping("/{assessmentId}/questions")
    public List<AssessmentQuestionResponse> getQuestions(
            @PathVariable Long assessmentId
    ) {

        return assessmentQuestionService
                .getQuestions(assessmentId);
    }
}