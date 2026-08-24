package com.airecruitment.assessment.serviceimpl;

import com.airecruitment.assessment.dto.AssessmentEvaluationResponse;
import com.airecruitment.assessment.dto.SubmitAssessmentRequest;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentAnswer;
import com.airecruitment.assessment.entity.AssessmentQuestion;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.assessment.enums.QuestionType;
import com.airecruitment.assessment.repository.AssessmentAnswerRepository;
import com.airecruitment.assessment.repository.AssessmentQuestionRepository;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;
import com.airecruitment.assessment.service.AssessmentEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssessmentEvaluationServiceImpl
        implements AssessmentEvaluationService {

    private final AssessmentRepository assessmentRepository;

    private final AssessmentQuestionRepository questionRepository;

    private final AssessmentAnswerRepository answerRepository;

    private final AssessmentResultRepository resultRepository;

    @Override
    @Transactional
    public AssessmentEvaluationResponse submitAssessment(
            Long assessmentId,
            SubmitAssessmentRequest request
    ) {

        // 1. Find assessment
        Assessment assessment = assessmentRepository
                .findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found: " + assessmentId
                        )
                );

        // 2. Prevent duplicate submission
        if (resultRepository.findByAssessment(assessment).isPresent()) {
            throw new RuntimeException(
                    "Assessment has already been submitted."
            );
        }

        // 3. Get all questions
        List<AssessmentQuestion> questions =
                questionRepository
                        .findByAssessmentOrderByQuestionOrder(
                                assessment
                        );

        if (questions.isEmpty()) {
            throw new RuntimeException(
                    "No questions found for this assessment."
            );
        }

        // 4. Convert submitted answers into Map
        Map<Long, String> submittedAnswers =
                new HashMap<>();

        if (request != null && request.getAnswers() != null) {

            for (SubmitAssessmentRequest.AnswerSubmission submission
                    : request.getAnswers()) {

                if (submission.getQuestionId() != null) {

                    submittedAnswers.put(
                            submission.getQuestionId(),
                            normalizeAnswer(submission.getAnswer())
                    );
                }
            }
        }

        int attemptedQuestions = 0;
        int correctAnswers = 0;

        int aptitudeTotal = 0;
        int aptitudeCorrect = 0;

        int technicalTotal = 0;
        int technicalCorrect = 0;

        int codingTotal = 0;
        int codingCorrect = 0;

        // 5. Evaluate every question
        for (AssessmentQuestion question : questions) {

            String submittedAnswer =
                    submittedAnswers.get(question.getId());

            boolean attempted =
                    submittedAnswer != null &&
                            !submittedAnswer.isBlank();

            boolean correct = false;

            if (attempted) {

                attemptedQuestions++;

                correct = normalizeAnswer(
                        question.getCorrectAnswer()
                ).equals(submittedAnswer);

                if (correct) {
                    correctAnswers++;
                }
            }

            // Category calculation
            String topic =
                    question.getTopic() == null
                            ? ""
                            : question.getTopic().toLowerCase();

            QuestionType type =
                    question.getQuestionType();

            if (topic.contains("aptitude")
                    || topic.contains("reasoning")
                    || topic.contains("quantitative")) {

                aptitudeTotal++;

                if (correct) {
                    aptitudeCorrect++;
                }

            } else if (type == QuestionType.CODING) {

                codingTotal++;

                if (correct) {
                    codingCorrect++;
                }

            } else {

                technicalTotal++;

                if (correct) {
                    technicalCorrect++;
                }
            }

            // 6. Save candidate answer
            AssessmentAnswer existingAnswer =
                    answerRepository
                            .findByAssessmentAndQuestionAndCandidate(
                                    assessment,
                                    question,
                                    assessment.getCandidate()
                            )
                            .orElse(null);

            AssessmentAnswer answer;

            if (existingAnswer != null) {

                answer = existingAnswer;

            } else {

                answer = AssessmentAnswer.builder()
                        .assessment(assessment)
                        .question(question)
                        .candidate(assessment.getCandidate())
                        .build();
            }

            answer.setAnswer(submittedAnswer);
            answer.setCorrect(correct);
            answer.setScore(correct ? 1.0 : 0.0);

            answerRepository.save(answer);
        }

        // 7. Calculate category scores
        double aptitudeScore =
                calculatePercentage(
                        aptitudeCorrect,
                        aptitudeTotal
                );

        double technicalScore =
                calculatePercentage(
                        technicalCorrect,
                        technicalTotal
                );

        double codingScore =
                calculatePercentage(
                        codingCorrect,
                        codingTotal
                );

        // 8. Overall score
        double overallScore =
                calculatePercentage(
                        correctAnswers,
                        questions.size()
                );

        // 9. Pass criteria
        boolean passed =
                overallScore >= 60.0;

        String recommendation;

        if (overallScore >= 80) {

            recommendation = "STRONG_CANDIDATE";

        } else if (overallScore >= 60) {

            recommendation = "ELIGIBLE_FOR_INTERVIEW";

        } else {

            recommendation = "NOT_ELIGIBLE";
        }

        // 10. Feedback
        String feedback =
                buildFeedback(
                        overallScore,
                        attemptedQuestions,
                        questions.size(),
                        correctAnswers,
                        passed
                );

        // 11. Save result
        AssessmentResult result =
                AssessmentResult.builder()
                        .assessment(assessment)
                        .totalQuestions(questions.size())
                        .attemptedQuestions(attemptedQuestions)
                        .correctAnswers(correctAnswers)
                        .aptitudeScore(aptitudeScore)
                        .technicalScore(technicalScore)
                        .codingScore(codingScore)
                        .overallScore(overallScore)
                        .passed(passed)
                        .recommendation(recommendation)
                        .feedback(feedback)
                        .build();

        resultRepository.save(result);

        // 12. Update assessment status
        assessment.setStatus(
                AssessmentStatus.COMPLETED
        );

        assessmentRepository.save(assessment);

        // 13. Return response
        return AssessmentEvaluationResponse.builder()
                .assessmentId(assessment.getId())
                .totalQuestions(questions.size())
                .attemptedQuestions(attemptedQuestions)
                .correctAnswers(correctAnswers)
                .aptitudeScore(aptitudeScore)
                .technicalScore(technicalScore)
                .codingScore(codingScore)
                .overallScore(overallScore)
                .passed(passed)
                .recommendation(recommendation)
                .feedback(feedback)
                .build();
    }

    private String normalizeAnswer(String answer) {

        if (answer == null) {
            return "";
        }

        return answer
                .trim()
                .toUpperCase();
    }

    private double calculatePercentage(
            int correct,
            int total
    ) {

        if (total == 0) {
            return 0.0;
        }

        return Math.round(
                ((double) correct / total) * 10000
        ) / 100.0;
    }

    private String buildFeedback(
            double overallScore,
            int attempted,
            int total,
            int correct,
            boolean passed
    ) {

        if (passed) {

            return String.format(
                    "Candidate attempted %d out of %d questions "
                            + "and answered %d correctly. "
                            + "The candidate achieved an overall score "
                            + "of %.2f%% and is eligible for the next "
                            + "interview stage.",
                    attempted,
                    total,
                    correct,
                    overallScore
            );
        }

        return String.format(
                "Candidate attempted %d out of %d questions "
                        + "and answered %d correctly. "
                        + "The candidate achieved an overall score "
                        + "of %.2f%%, which is below the required "
                        + "60%% passing threshold.",
                attempted,
                total,
                correct,
                overallScore
        );
    }
}