package com.airecruitment.interview.serviceimpl;

import com.airecruitment.ai.client.AiClient;
import com.airecruitment.common.exception.InterviewNotEligibleException;
import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.interview.dto.InterviewResultResponse;
import com.airecruitment.interview.entity.InterviewAnswer;
import com.airecruitment.interview.entity.InterviewQuestion;
import com.airecruitment.interview.repository.InterviewAnswerRepository;
import com.airecruitment.interview.repository.InterviewQuestionRepository;
import com.airecruitment.interview.service.InterviewService;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.airecruitment.interview.entity.InterviewResult;
import com.airecruitment.interview.repository.InterviewResultRepository;
import java.util.List;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final JobRepository jobRepository;

    private final ResumeRepository resumeRepository;

    private final InterviewQuestionRepository interviewQuestionRepository;

    private final AiClient aiClient;

    private final InterviewAnswerRepository interviewAnswerRepository;

    private final UserRepository userRepository;

    private final InterviewResultRepository interviewResultRepository;

    private final AssessmentRepository assessmentRepository;

    private final AssessmentResultRepository assessmentResultRepository;

    // =========================================================
    // GENERATE INTERVIEW QUESTIONS
    // =========================================================

    @Override
    public InterviewQuestionsResponse generateQuestions(
            Long jobId,
            Long candidateId,
            Long resumeId) {


        // =========================================================
        // 0. CHECK ASSESSMENT ELIGIBILITY
        // =========================================================

        AssessmentResult assessmentResult =
                findLatestAssessmentResult(
                        candidateId,
                        jobId,
                        resumeId
                );

        if (!Boolean.TRUE.equals(assessmentResult.getPassed())) {

            throw new InterviewNotEligibleException(
                    "Candidate is not eligible for the interview. Assessment score: "
                            + assessmentResult.getOverallScore()
                            + "%. Minimum passing score is 60%."
            );
        }


        // 1. Find Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );


        // 2. Find Resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found.")
                );


        // 3. Validate candidate
        if (!resume.getCandidate().getId().equals(candidateId)) {

            throw new RuntimeException(
                    "Resume does not belong to the candidate."
            );
        }


        // 4. Build prompt
        String prompt = buildInterviewPrompt(job, resume);


        // 5. Generate questions using AI
        InterviewQuestionsResponse response =
                aiClient.generateInterviewQuestions(
                        prompt,
                        job.getId(),
                        candidateId,
                        resume.getId(),
                        job.getTitle()
                );


        // 6. Save generated questions into database
        for (com.airecruitment.interview.dto.InterviewQuestion questionDto
                : response.getQuestions()) {

            InterviewQuestion question =
                    InterviewQuestion.builder()
                            .job(job)
                            .resume(resume)
                            .question(questionDto.getQuestion())
                            .type(questionDto.getType())
                            .difficulty(questionDto.getDifficulty())
                            .build();

            interviewQuestionRepository.save(question);
        }


        // 7. Return response
        return response;
    }

    private AssessmentResult findLatestAssessmentResult(
            Long candidateId,
            Long jobId,
            Long resumeId) {

        User candidate = userRepository
                .findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidate not found."
                        )
                );

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."
                        )
                );

        Resume resume = resumeRepository
                .findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found."
                        )
                );

        if (!resume.getCandidate().getId().equals(candidateId)) {

            throw new RuntimeException(
                    "Resume does not belong to the candidate."
            );
        }

        Assessment assessment =
                assessmentRepository
                        .findByCandidateAndJobAndResume(
                                candidate,
                                job,
                                resume
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found. " +
                                                "Candidate must complete the assessment first."
                                )
                        );

        return assessmentResultRepository
                .findByAssessment(assessment)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment result not found. " +
                                        "Candidate must complete the assessment first."
                        )
                );
    }

    // =========================================================
    // BUILD INTERVIEW QUESTION PROMPT
    // =========================================================

    private String buildInterviewPrompt(
            Job job,
            Resume resume) {

        return """
                You are an expert technical interviewer.

                Generate interview questions for a candidate based
                on the job description and candidate resume.

                ==============================
                JOB INFORMATION
                ==============================

                JOB TITLE:
                %s

                JOB DESCRIPTION:
                %s

                REQUIRED SKILLS:
                %s

                PREFERRED SKILLS:
                %s

                EXPERIENCE REQUIRED:
                %s


                ==============================
                CANDIDATE RESUME
                ==============================

                %s


                ==============================
                INSTRUCTIONS
                ==============================

                Generate exactly 10 interview questions.

                Questions should be personalized according to:

                1. Job requirements
                2. Candidate technical skills
                3. Candidate projects
                4. Candidate experience
                5. Skill gaps between candidate and job

                Include a mixture of:

                - Technical questions
                - HR questions
                - Skill-gap questions

                Difficulty levels should include:

                EASY
                MEDIUM
                HARD


                ==============================
                RESPONSE FORMAT
                ==============================

                Return ONLY valid JSON.

                Do not return markdown.

                Do not use ```json.

                Do not add explanations outside the JSON.

                The response must follow this exact structure:

                {
                  "questions": [
                    {
                      "question": "Question text",
                      "type": "TECHNICAL",
                      "difficulty": "MEDIUM"
                    }
                  ]
                }

                The type must be one of:

                TECHNICAL
                HR
                SKILL_GAP

                The difficulty must be one of:

                EASY
                MEDIUM
                HARD

                Generate exactly 10 questions.
                """.formatted(
                job.getTitle(),
                job.getDescription(),
                job.getRequiredSkills(),
                job.getPreferredSkills(),
                job.getExperienceRequired(),
                resume.getExtractedText()
        );
    }


    // =========================================================
    // SUBMIT INTERVIEW ANSWER
    // =========================================================

    @Override
    public InterviewEvaluationResponse submitAnswer(
            Long candidateId,
            Long questionId,
            String answer) {

        // 1. Find candidate
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found.")
                );


        // 2. Find question
        InterviewQuestion question =
                interviewQuestionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview question not found."
                                )
                        );


        // 3. Validate answer
        if (answer == null || answer.trim().isEmpty()) {

            throw new RuntimeException(
                    "Answer cannot be empty."
            );
        }


        // 4. Validate that the question belongs to the candidate's
        //    interview through the resume
        if (!question.getResume()
                .getCandidate()
                .getId()
                .equals(candidateId)) {

            throw new RuntimeException(
                    "Interview question does not belong to this candidate."
            );
        }


        // 5. Check whether candidate already answered
        InterviewAnswer interviewAnswer =
                interviewAnswerRepository
                        .findByCandidateAndQuestion(
                                candidate,
                                question
                        )
                        .orElse(null);


        // 6. Create answer if first submission
        if (interviewAnswer == null) {

            interviewAnswer = InterviewAnswer.builder()
                    .candidate(candidate)
                    .question(question)
                    .answer(answer)
                    .evaluationStatus("PENDING")
                    .build();

        } else {

            // Allow candidate to update/re-submit answer
            interviewAnswer.setAnswer(answer);
            interviewAnswer.setEvaluationStatus("PENDING");
        }


        // 7. Build AI evaluation prompt
        String prompt = buildEvaluationPrompt(
                question,
                answer
        );


        // 8. Evaluate using AI
        InterviewEvaluationResponse evaluation =
                aiClient.evaluateInterviewAnswer(prompt);


        // 9. Save evaluation
        interviewAnswer.setScore(
                evaluation.getScore()
        );

        interviewAnswer.setFeedback(
                evaluation.getFeedback()
        );

        interviewAnswer.setEvaluationStatus(
                "EVALUATED"
        );


        // 10. Save answer + evaluation
        interviewAnswerRepository.save(
                interviewAnswer
        );


        // 11. Return evaluation result
        evaluation.setEvaluationStatus(
                "EVALUATED"
        );

        return evaluation;
    }


    // =========================================================
    // BUILD ANSWER EVALUATION PROMPT
    // =========================================================

    private String buildEvaluationPrompt(
            InterviewQuestion question,
            String answer) {

        return """
                You are an expert technical interviewer.

                Evaluate the candidate's answer to the interview question.

                ==============================
                QUESTION
                ==============================

                %s


                QUESTION TYPE:
                %s


                DIFFICULTY:
                %s


                ==============================
                CANDIDATE ANSWER
                ==============================

                %s


                ==============================
                EVALUATION CRITERIA
                ==============================

                Evaluate the answer based on:

                1. Technical correctness
                2. Understanding of the concept
                3. Relevance to the question
                4. Completeness
                5. Clarity

                Give a score between 0 and 10.

                ==============================
                RESPONSE FORMAT
                ==============================

                Return ONLY valid JSON.

                Do not return markdown.

                Do not add explanations outside JSON.

                Return exactly:

                {
                  "score": 8.5,
                  "feedback": "Detailed feedback about the answer.",
                  "evaluationStatus": "EVALUATED"
                }

                Score must be between 0 and 10.
                """.formatted(
                question.getQuestion(),
                question.getType(),
                question.getDifficulty(),
                answer
        );
    }


    // =========================================================
    // GET FINAL INTERVIEW RESULT
    // =========================================================

    @Override
    public InterviewResultResponse getInterviewResult(
            Long candidateId,
            Long jobId) {

        // 1. Find candidate
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found.")
                );


        // 2. Find job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );


        // 3. Find all answers submitted by candidate
        List<InterviewAnswer> answers =
                interviewAnswerRepository.findByCandidate(candidate);


        // 4. Filter answers belonging to this job
        List<InterviewAnswer> jobAnswers =
                answers.stream()
                        .filter(answer ->
                                answer.getQuestion()
                                        .getJob()
                                        .getId()
                                        .equals(job.getId())
                        )
                        .toList();


        // 5. Check answers
        if (jobAnswers.isEmpty()) {

            throw new RuntimeException(
                    "No interview answers found for this job."
            );
        }


        // 6. Calculate overall score
        double overallScore =
                jobAnswers.stream()
                        .filter(answer ->
                                answer.getScore() != null
                        )
                        .mapToDouble(
                                InterviewAnswer::getScore
                        )
                        .average()
                        .orElse(0.0);


        // 7. Calculate technical score
        double technicalScore =
                calculateCategoryScore(
                        jobAnswers,
                        "TECHNICAL"
                );


        // 8. Calculate HR score
        double hrScore =
                calculateCategoryScore(
                        jobAnswers,
                        "HR"
                );


        // 9. Calculate skill-gap score
        double skillGapScore =
                calculateCategoryScore(
                        jobAnswers,
                        "SKILL_GAP"
                );


        // 10. Create response
        InterviewResultResponse response =
                new InterviewResultResponse();


        response.setCandidateId(
                candidateId
        );

        response.setJobId(
                jobId
        );


        // Total number of questions
        response.setTotalQuestions(
                10
        );


        // Number of submitted answers
        response.setAnsweredQuestions(
                jobAnswers.size()
        );


        // Average score out of 10
        response.setAverageScore(
                round(overallScore)
        );


        // Overall percentage
        response.setOverallScore(
                round(overallScore * 10)
        );


        // Category percentages
        response.setTechnicalScore(
                round(technicalScore * 10)
        );

        response.setHrScore(
                round(hrScore * 10)
        );

        response.setSkillGapScore(
                round(skillGapScore * 10)
        );


        // Final recommendation
        response.setRecommendation(
                getRecommendation(overallScore)
        );

        response.setSummary(
                generateSummary(overallScore)
        );


// =========================================================
// SAVE FINAL RESULT
// =========================================================

        InterviewResult interviewResult =
                interviewResultRepository
                        .findByCandidateAndJob(
                                candidate,
                                job
                        )
                        .orElse(
                                InterviewResult.builder()
                                        .candidate(candidate)
                                        .job(job)
                                        .build()
                        );

        interviewResult.setTotalQuestions(
                response.getTotalQuestions()
        );

        interviewResult.setAnsweredQuestions(
                response.getAnsweredQuestions()
        );

        interviewResult.setAverageScore(
                response.getAverageScore()
        );

        interviewResult.setOverallScore(
                response.getOverallScore()
        );

        interviewResult.setTechnicalScore(
                response.getTechnicalScore()
        );

        interviewResult.setHrScore(
                response.getHrScore()
        );

        interviewResult.setSkillGapScore(
                response.getSkillGapScore()
        );

        interviewResult.setRecommendation(
                response.getRecommendation()
        );

        interviewResult.setSummary(
                response.getSummary()
        );

        interviewResultRepository.save(
                interviewResult
        );


        return response;
    }


    // =========================================================
    // CALCULATE CATEGORY SCORE
    // =========================================================

    private double calculateCategoryScore(
            List<InterviewAnswer> answers,
            String type) {

        return answers.stream()
                .filter(answer ->
                        answer.getQuestion()
                                .getType()
                                .equalsIgnoreCase(type)
                )
                .filter(answer ->
                        answer.getScore() != null
                )
                .mapToDouble(
                        InterviewAnswer::getScore
                )
                .average()
                .orElse(0.0);
    }


    // =========================================================
    // FINAL RECOMMENDATION
    // =========================================================

    private String getRecommendation(
            double score) {

        if (score >= 8.0) {
            return "SELECT";
        }

        if (score >= 6.0) {
            return "CONSIDER";
        }

        if (score >= 4.0) {
            return "WEAK_MATCH";
        }

        return "REJECT";
    }


    // =========================================================
    // FINAL SUMMARY
    // =========================================================

    private String generateSummary(
            double score) {

        if (score >= 8.0) {

            return "Candidate demonstrates strong overall interview performance and is recommended for selection.";
        }


        if (score >= 6.0) {

            return "Candidate demonstrates good potential but has some areas that may require improvement.";
        }


        if (score >= 4.0) {

            return "Candidate demonstrates partial understanding but requires significant improvement in several areas.";
        }


        return "Candidate's interview performance is below the expected level for this position.";
    }


    // =========================================================
    // ROUND DECIMAL VALUE
    // =========================================================

    private double round(
            double value) {

        return Math.round(
                value * 100.0
        ) / 100.0;
    }
}