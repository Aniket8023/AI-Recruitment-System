package com.airecruitment.assessment.serviceimpl;

import com.airecruitment.ai.client.AiClient;
import com.airecruitment.assessment.dto.AIQuestionResponse;
import com.airecruitment.assessment.dto.AIQuestionsResponse;
import com.airecruitment.assessment.dto.AssessmentQuestionResponse;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentQuestion;
import com.airecruitment.assessment.enums.QuestionType;
import com.airecruitment.assessment.repository.AssessmentQuestionRepository;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.service.AssessmentQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentQuestionServiceImpl
        implements AssessmentQuestionService {

    private final AssessmentRepository assessmentRepository;

    private final AssessmentQuestionRepository questionRepository;

    private final AiClient aiClient;


    @Override
    @Transactional
    public List<AssessmentQuestion> generateQuestions(
            Long assessmentId
    ) {

        Assessment assessment = assessmentRepository
                .findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found: " + assessmentId
                        )
                );


        /*
         * Check whether questions are already generated.
         *
         * If questions already exist, do NOT call Gemini again.
         */
        List<AssessmentQuestion> existingQuestions =
                questionRepository
                        .findByAssessmentOrderByQuestionOrder(
                                assessment
                        );

        if (!existingQuestions.isEmpty()) {

            return existingQuestions;
        }


        /*
         * Total number of questions required.
         */
        int totalQuestions = assessment.getTotalQuestions();

        if (totalQuestions <= 0) {

            throw new RuntimeException(
                    "Assessment total questions must be greater than zero."
            );
        }


        /*
         * ONE Gemini API call.
         *
         * Gemini will generate ALL questions together.
         */
        String prompt =
                buildQuestionsPrompt(
                        assessment,
                        totalQuestions
                );


        AIQuestionsResponse aiResponse =
                aiClient.generateQuestions(prompt);


        if (aiResponse == null ||
                aiResponse.getQuestions() == null ||
                aiResponse.getQuestions().isEmpty()) {

            throw new RuntimeException(
                    "AI failed to generate assessment questions."
            );
        }


        List<AIQuestionResponse> aiQuestions =
                aiResponse.getQuestions();


        /*
         * Validate number of questions.
         */
        if (aiQuestions.size() != totalQuestions) {

            throw new RuntimeException(
                    "AI generated " +
                            aiQuestions.size() +
                            " questions instead of " +
                            totalQuestions
            );
        }


        /*
         * Convert AI DTOs into JPA entities.
         */
        List<AssessmentQuestion> questions =
                new ArrayList<>();


        for (int i = 0; i < aiQuestions.size(); i++) {

            AIQuestionResponse aiQuestion =
                    aiQuestions.get(i);


            AssessmentQuestion question =
                    AssessmentQuestion.builder()

                            .assessment(assessment)

                            .questionText(
                                    aiQuestion.getQuestionText()
                            )

                            .questionType(
                                    parseQuestionType(
                                            aiQuestion.getQuestionType()
                                    )
                            )

                            .options(
                                    aiQuestion.getOptions()
                            )

                            .correctAnswer(
                                    aiQuestion.getCorrectAnswer()
                            )

                            .difficulty(
                                    aiQuestion.getDifficulty()
                            )

                            .topic(
                                    aiQuestion.getTopic()
                            )

                            .questionOrder(i + 1)

                            .assessmentType(
                                    assessment.getType()
                            )

                            .build();


            questions.add(question);
        }


        /*
         * Save ALL questions in one repository operation.
         */
        return questionRepository.saveAll(questions);
    }


    private QuestionType parseQuestionType(
            String questionType
    ) {

        if (questionType == null) {

            return QuestionType.MCQ;
        }


        try {

            return QuestionType.valueOf(
                    questionType
                            .trim()
                            .toUpperCase()
            );

        } catch (IllegalArgumentException e) {

            return QuestionType.MCQ;
        }
    }


    private String buildQuestionsPrompt(
            Assessment assessment,
            int totalQuestions
    ) {

        String jobTitle =
                assessment.getJob().getTitle();


        String description =
                assessment.getJob().getDescription();


        String requiredSkills =
                assessment.getJob().getRequiredSkills();


        String preferredSkills =
                assessment.getJob().getPreferredSkills();


        /*
         * Decide distribution.
         *
         * For 20 questions:
         *
         * 1-10  Technical
         * 11-15 Aptitude
         * 16-20 Technical
         *
         * For other totals, AI can maintain a balanced
         * distribution.
         */
        return """
                You are an expert technical recruitment assessment generator.

                Generate EXACTLY %d high-quality assessment questions
                in ONE response.

                Do NOT generate questions one by one.
                Return ALL questions together in a single JSON object.

                JOB TITLE:
                %s

                JOB DESCRIPTION:
                %s

                REQUIRED SKILLS:
                %s

                PREFERRED SKILLS:
                %s


                QUESTION DISTRIBUTION:

                For a 20-question assessment:

                Questions 1-10:
                TECHNICAL

                Questions 11-15:
                APTITUDE

                Questions 16-20:
                TECHNICAL / PROBLEM SOLVING


                GENERAL RULES:

                1. Generate exactly %d questions.

                2. Every question must be relevant to the
                   provided job.

                3. Question type must be MCQ.

                4. Every question must have exactly four options.

                5. Options must be labelled:
                   A, B, C, D.

                6. There must be exactly one correct answer.

                7. correctAnswer must contain only:
                   A, B, C or D.

                8. Difficulty must be one of:
                   EASY, MEDIUM, HARD.

                9. Avoid duplicate questions.

                10. Avoid trivial questions.

                11. Technical questions must focus on technologies,
                    concepts and skills relevant to the job.

                12. Aptitude questions must test:
                    logical reasoning,
                    numerical ability,
                    analytical thinking,
                    or problem solving.

                13. Do not ask questions unrelated to the job.

                14. Do not include explanations.

                15. Return ONLY valid structured JSON.

                RESPONSE FORMAT:

                {
                  "questions": [
                    {
                      "questionText": "Question here",
                      "questionType": "MCQ",
                      "options": "A|Option 1|B|Option 2|C|Option 3|D|Option 4",
                      "correctAnswer": "A",
                      "difficulty": "EASY",
                      "topic": "Java"
                    }
                  ]
                }

                The "questions" array MUST contain exactly %d objects.
                """.formatted(
                totalQuestions,
                jobTitle,
                description,
                requiredSkills,
                preferredSkills,
                totalQuestions,
                totalQuestions
        );
    }


    @Override
    @Transactional(readOnly = true)
    public List<AssessmentQuestionResponse> getQuestions(
            Long assessmentId
    ) {

        Assessment assessment = assessmentRepository
                .findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found: " + assessmentId
                        )
                );


        List<AssessmentQuestion> questions =
                questionRepository
                        .findByAssessmentOrderByQuestionOrder(
                                assessment
                        );


        if (questions.isEmpty()) {

            throw new RuntimeException(
                    "No questions generated for this assessment."
            );
        }


        return questions.stream()
                .map(question ->
                        AssessmentQuestionResponse.builder()

                                .questionId(
                                        question.getId()
                                )

                                .questionText(
                                        question.getQuestionText()
                                )

                                .questionType(
                                        question.getQuestionType()
                                )

                                .options(
                                        question.getOptions()
                                )

                                .difficulty(
                                        question.getDifficulty()
                                )

                                .topic(
                                        question.getTopic()
                                )

                                .questionOrder(
                                        question.getQuestionOrder()
                                )

                                .build()
                )
                .toList();
    }
}