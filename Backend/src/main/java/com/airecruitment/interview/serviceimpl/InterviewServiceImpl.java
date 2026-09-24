package com.airecruitment.interview.serviceimpl;

import com.airecruitment.ai.client.AiClient;
import com.airecruitment.ai.service.AudioTranscriptionService;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.entity.AssessmentResult;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.repository.AssessmentResultRepository;
import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.common.exception.InterviewNotEligibleException;
import com.airecruitment.interview.dto.*;
import com.airecruitment.interview.entity.InterviewAnswer;
import com.airecruitment.interview.entity.InterviewQuestion;
import com.airecruitment.interview.entity.InterviewResult;
import com.airecruitment.interview.repository.InterviewAnswerRepository;
import com.airecruitment.interview.repository.InterviewQuestionRepository;
import com.airecruitment.interview.repository.InterviewResultRepository;
import com.airecruitment.interview.service.InterviewService;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.match.repository.JobMatchRepository;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    private final JobMatchRepository jobMatchRepository;

    private final AudioTranscriptionService audioTranscriptionService;

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

        if (!Boolean.TRUE.equals(
                assessmentResult.getPassed())) {

            throw new InterviewNotEligibleException(
                    "Candidate is not eligible for the interview. "
                            + "Assessment score: "
                            + assessmentResult.getOverallScore()
                            + "%. Minimum passing score is 60%."
            );
        }


        // =========================================================
        // 1. FIND JOB
        // =========================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        // =========================================================
        // 2. FIND RESUME
        // =========================================================

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found."
                                )
                        );


        // =========================================================
        // 3. VALIDATE CANDIDATE
        // =========================================================

        if (!resume.getCandidate()
                .getId()
                .equals(candidateId)) {

            throw new RuntimeException(
                    "Resume does not belong to the candidate."
            );
        }


        // =========================================================
        // 4. PREVENT DUPLICATE QUESTION GENERATION
        // =========================================================

        List<InterviewQuestion> existingQuestions =
                interviewQuestionRepository
                        .findByJobIdAndResumeId(
                                job.getId(),
                                resume.getId()
                        );


        if (!existingQuestions.isEmpty()) {

            throw new RuntimeException(
                    "Interview questions have already been generated "
                            + "for this candidate and job."
            );
        }


        // =========================================================
        // 5. BUILD PROMPT
        // =========================================================

        String prompt =
                buildInterviewPrompt(
                        job,
                        resume
                );


        // =========================================================
        // 6. GENERATE QUESTIONS USING AI
        // =========================================================

        InterviewQuestionsResponse response =
                aiClient.generateInterviewQuestions(
                        prompt,
                        job.getId(),
                        candidateId,
                        resume.getId(),
                        job.getTitle()
                );


        // =========================================================
        // 7. VALIDATE AI RESPONSE
        // =========================================================

        if (response == null ||
                response.getQuestions() == null ||
                response.getQuestions().isEmpty()) {

            throw new RuntimeException(
                    "AI failed to generate interview questions."
            );
        }


        // =========================================================
        // 8. SAVE GENERATED QUESTIONS
        // =========================================================

        for (com.airecruitment.interview.dto.InterviewQuestion questionDto
                : response.getQuestions()) {

            InterviewQuestion question =
                    InterviewQuestion.builder()
                            .job(job)
                            .resume(resume)
                            .question(
                                    questionDto.getQuestion()
                            )
                            .type(
                                    questionDto.getType()
                            )
                            .difficulty(
                                    questionDto.getDifficulty()
                            )
                            .build();

            interviewQuestionRepository.save(
                    question
            );
        }


        // =========================================================
        // 9. RETURN RESPONSE
        // =========================================================

        return response;
    }


    // =========================================================
    // FIND LATEST ASSESSMENT RESULT
    // =========================================================

    private AssessmentResult findLatestAssessmentResult(
            Long candidateId,
            Long jobId,
            Long resumeId) {

        // =========================================================
        // FIND CANDIDATE
        // =========================================================

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // FIND JOB
        // =========================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        // =========================================================
        // FIND RESUME
        // =========================================================

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found."
                                )
                        );


        // =========================================================
        // VALIDATE RESUME OWNERSHIP
        // =========================================================

        if (!resume.getCandidate()
                .getId()
                .equals(candidateId)) {

            throw new RuntimeException(
                    "Resume does not belong to the candidate."
            );
        }


        // =========================================================
        // FIND ASSESSMENT
        // =========================================================

        Assessment assessment =
                assessmentRepository
                        .findByCandidateAndJobAndResume(
                                candidate,
                                job,
                                resume
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Assessment not found. "
                                                + "Candidate must complete "
                                                + "the assessment first."
                                )
                        );


        // =========================================================
        // FIND ASSESSMENT RESULT
        // =========================================================

        return assessmentResultRepository
                .findByAssessment(assessment)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment result not found. "
                                        + "Candidate must complete "
                                        + "the assessment first."
                        )
                );
    }


    // =========================================================
    // GET GENERATED INTERVIEW QUESTIONS
    // =========================================================

    @Override
    public List<InterviewQuestionResponse> getQuestions(
            Long candidateId,
            Long jobId,
            Long resumeId) {

        // =========================================================
        // 1. CHECK ASSESSMENT ELIGIBILITY
        // =========================================================

        AssessmentResult assessmentResult =
                findLatestAssessmentResult(
                        candidateId,
                        jobId,
                        resumeId
                );


        if (!Boolean.TRUE.equals(
                assessmentResult.getPassed())) {

            throw new InterviewNotEligibleException(
                    "Candidate is not eligible for the interview. "
                            + "Assessment score: "
                            + assessmentResult.getOverallScore()
                            + "%. Minimum passing score is 60%."
            );
        }


        // =========================================================
        // 2. FIND CANDIDATE
        // =========================================================

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // 3. FIND JOB
        // =========================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        // =========================================================
        // 4. FIND RESUME
        // =========================================================

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found."
                                )
                        );


        // =========================================================
        // 5. VALIDATE RESUME OWNERSHIP
        // =========================================================

        if (!resume.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "Resume does not belong to this candidate."
            );
        }


        // =========================================================
        // 6. FIND QUESTIONS
        // =========================================================

        List<InterviewQuestion> questions =
                interviewQuestionRepository
                        .findByJobIdAndResumeId(
                                job.getId(),
                                resume.getId()
                        );


        // =========================================================
        // 7. CHECK QUESTIONS
        // =========================================================

        if (questions.isEmpty()) {

            throw new RuntimeException(
                    "No interview questions found."
            );
        }


        // =========================================================
        // 8. CONVERT ENTITY -> DTO
        // =========================================================

        return questions.stream()
                .map(question ->
                        new InterviewQuestionResponse(
                                question.getId(),
                                question.getQuestion(),
                                question.getType(),
                                question.getDifficulty()
                        )
                )
                .toList();
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

        // =========================================================
        // 1. FIND CANDIDATE
        // =========================================================

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // 2. FIND QUESTION
        // =========================================================

        InterviewQuestion question =
                interviewQuestionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview question not found."
                                )
                        );


        // =========================================================
        // 3. VALIDATE ANSWER
        // =========================================================

        if (answer == null ||
                answer.trim().isEmpty()) {

            throw new RuntimeException(
                    "Answer cannot be empty."
            );
        }


        // =========================================================
        // 4. VALIDATE CANDIDATE OWNERSHIP
        // =========================================================

        if (!question.getResume()
                .getCandidate()
                .getId()
                .equals(candidateId)) {

            throw new RuntimeException(
                    "Interview question does not belong "
                            + "to this candidate."
            );
        }


        // =========================================================
        // 5. CHECK DUPLICATE ANSWER
        // =========================================================

        boolean alreadyAnswered =
                interviewAnswerRepository
                        .findByCandidateAndQuestion(
                                candidate,
                                question
                        )
                        .isPresent();


        if (alreadyAnswered) {

            throw new RuntimeException(
                    "Answer has already been submitted "
                            + "for this question."
            );
        }


        // =========================================================
        // 6. CREATE ANSWER
        // =========================================================

        InterviewAnswer interviewAnswer =
                InterviewAnswer.builder()
                        .candidate(candidate)
                        .question(question)
                        .answer(answer)
                        .evaluationStatus("PENDING")
                        .build();


        // =========================================================
        // 7. BUILD AI EVALUATION PROMPT
        // =========================================================

        String prompt =
                buildEvaluationPrompt(
                        question,
                        answer
                );


        // =========================================================
        // 8. EVALUATE USING AI
        // =========================================================

        InterviewEvaluationResponse evaluation =
                aiClient.evaluateInterviewAnswer(
                        prompt
                );


        // =========================================================
        // 9. SAVE EVALUATION
        // =========================================================

        interviewAnswer.setScore(
                evaluation.getScore()
        );

        interviewAnswer.setFeedback(
                evaluation.getFeedback()
        );

        interviewAnswer.setEvaluationStatus(
                "EVALUATED"
        );


        // =========================================================
        // 10. SAVE ANSWER
        // =========================================================

        interviewAnswerRepository.save(
                interviewAnswer
        );


        // =========================================================
        // 11. RETURN EVALUATION
        // =========================================================

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
    @Transactional
    public InterviewResultResponse getInterviewResult(
            Long candidateId,
            Long jobId) {

        // =========================================================
        // 1. FIND CANDIDATE
        // =========================================================

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // 2. FIND JOB
        // =========================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        // =========================================================
        // 3. CHECK IF FINAL RESULT ALREADY EXISTS
        // =========================================================

        Optional<InterviewResult> existingResult =
                interviewResultRepository
                        .findByCandidateAndJob(
                                candidate,
                                job
                        );


        if (existingResult.isPresent()) {

            InterviewResult savedResult =
                    existingResult.get();

            InterviewResultResponse response =
                    new InterviewResultResponse();

            response.setCandidateId(
                    savedResult.getCandidate().getId()
            );

            response.setJobId(
                    savedResult.getJob().getId()
            );

            response.setTotalQuestions(
                    savedResult.getTotalQuestions()
            );

            response.setAnsweredQuestions(
                    savedResult.getAnsweredQuestions()
            );

            response.setAverageScore(
                    savedResult.getAverageScore()
            );

            response.setOverallScore(
                    savedResult.getOverallScore()
            );

            response.setTechnicalScore(
                    savedResult.getTechnicalScore()
            );

            response.setHrScore(
                    savedResult.getHrScore()
            );

            response.setSkillGapScore(
                    savedResult.getSkillGapScore()
            );

            response.setRecommendation(
                    savedResult.getRecommendation()
            );

            response.setSummary(
                    savedResult.getSummary()
            );

            // Security / termination fields
            response.setIntegrityViolation(
                    savedResult.getIntegrityViolation()
            );

            response.setViolationCount(
                    savedResult.getViolationCount()
            );

            response.setTerminationReason(
                    savedResult.getTerminationReason()
            );

            response.setInterviewStatus(
                    savedResult.getInterviewStatus()
            );

            return response;
        }


        // =========================================================
        // 4. FIND ALL ANSWERS OF CANDIDATE
        // =========================================================

        List<InterviewAnswer> answers =
                interviewAnswerRepository
                        .findByCandidate(candidate);


        // =========================================================
        // 5. FILTER ANSWERS FOR THIS JOB
        // =========================================================

        List<InterviewAnswer> jobAnswers =
                answers.stream()
                        .filter(answer ->
                                answer.getQuestion()
                                        .getJob()
                                        .getId()
                                        .equals(job.getId())
                        )
                        .toList();


        // =========================================================
        // 6. CHECK WHETHER ANSWERS EXIST
        // =========================================================

        if (jobAnswers.isEmpty()) {

            throw new RuntimeException(
                    "No interview answers found for this job."
            );
        }


        // =========================================================
        // 7. FIND RESUME FROM ANSWERS
        // =========================================================

        Resume resume =
                jobAnswers.get(0)
                        .getQuestion()
                        .getResume();


        Long resumeId =
                resume.getId();


        // =========================================================
        // 8. FIND GENERATED QUESTIONS
        // =========================================================

        List<InterviewQuestion> interviewQuestions =
                interviewQuestionRepository
                        .findByJobIdAndResumeId(
                                job.getId(),
                                resumeId
                        );


        int totalQuestions =
                interviewQuestions.size();


        // =========================================================
        // 9. VALIDATE TOTAL QUESTIONS
        // =========================================================

        if (totalQuestions == 0) {

            throw new RuntimeException(
                    "No interview questions found "
                            + "for this job and resume."
            );
        }


        // =========================================================
        // 10. CHECK INTERVIEW COMPLETION
        // =========================================================

        int answeredQuestions =
                jobAnswers.size();


        if (answeredQuestions < totalQuestions) {

            throw new RuntimeException(
                    "Interview is not completed. "
                            + answeredQuestions
                            + " out of "
                            + totalQuestions
                            + " questions have been answered."
            );
        }


        // =========================================================
        // 11. CHECK EVALUATION COMPLETION
        // =========================================================

        long evaluatedAnswers =
                jobAnswers.stream()
                        .filter(answer ->
                                "EVALUATED".equalsIgnoreCase(
                                        answer.getEvaluationStatus()
                                )
                        )
                        .count();


        if (evaluatedAnswers < totalQuestions) {

            throw new RuntimeException(
                    "Interview evaluation is not completed. "
                            + evaluatedAnswers
                            + " out of "
                            + totalQuestions
                            + " answers have been evaluated."
            );
        }


        // =========================================================
        // 12. CALCULATE OVERALL SCORE
        // =========================================================

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


        // =========================================================
        // 13. CALCULATE TECHNICAL SCORE
        // =========================================================

        double technicalScore =
                calculateCategoryScore(
                        jobAnswers,
                        "TECHNICAL"
                );


        // =========================================================
        // 14. CALCULATE HR SCORE
        // =========================================================

        double hrScore =
                calculateCategoryScore(
                        jobAnswers,
                        "HR"
                );


        // =========================================================
        // 15. CALCULATE SKILL GAP SCORE
        // =========================================================

        double skillGapScore =
                calculateCategoryScore(
                        jobAnswers,
                        "SKILL_GAP"
                );


        // =========================================================
        // 16. CREATE RESPONSE
        // =========================================================

        InterviewResultResponse response =
                new InterviewResultResponse();


        response.setCandidateId(
                candidateId
        );


        response.setJobId(
                jobId
        );


        response.setTotalQuestions(
                totalQuestions
        );


        response.setAnsweredQuestions(
                answeredQuestions
        );


        response.setAverageScore(
                round(overallScore)
        );


        response.setOverallScore(
                round(overallScore * 10)
        );


        response.setTechnicalScore(
                round(technicalScore * 10)
        );


        response.setHrScore(
                round(hrScore * 10)
        );


        response.setSkillGapScore(
                round(skillGapScore * 10)
        );


        // =========================================================
        // 17. FINAL RECOMMENDATION
        // =========================================================

        response.setRecommendation(
                getRecommendation(
                        overallScore
                )
        );


        // =========================================================
        // 18. FINAL SUMMARY
        // =========================================================

        response.setSummary(
                generateSummary(
                        overallScore
                )
        );


        // =========================================================
        // 19. NORMAL INTERVIEW STATUS
        // =========================================================

        response.setIntegrityViolation(false);

        response.setViolationCount(0);

        response.setTerminationReason(null);

        response.setInterviewStatus("COMPLETED");


        // =========================================================
        // 20. UPDATE JOB MATCH STATUS
        // =========================================================

        JobMatch jobMatch =
                jobMatchRepository
                        .findByJobAndResume(
                                job,
                                resume
                        )
                        .orElse(null);


        if (jobMatch != null) {

            String recommendation =
                    response.getRecommendation();

            if ("SELECT".equalsIgnoreCase(
                    recommendation)) {

                jobMatch.setStatus(
                        MatchStatus.SHORTLISTED
                );

            } else if ("REJECT".equalsIgnoreCase(
                    recommendation)) {

                jobMatch.setStatus(
                        MatchStatus.REJECTED
                );

            } else if ("CONSIDER".equalsIgnoreCase(
                    recommendation)) {

                jobMatch.setStatus(
                        MatchStatus.PENDING
                );
            }

            jobMatchRepository.save(jobMatch);
        }


        // =========================================================
        // 21. SAVE FINAL INTERVIEW RESULT
        // =========================================================

        InterviewResult interviewResult =
                InterviewResult.builder()
                        .candidate(candidate)
                        .job(job)
                        .totalQuestions(
                                response.getTotalQuestions()
                        )
                        .answeredQuestions(
                                response.getAnsweredQuestions()
                        )
                        .averageScore(
                                response.getAverageScore()
                        )
                        .overallScore(
                                response.getOverallScore()
                        )
                        .technicalScore(
                                response.getTechnicalScore()
                        )
                        .hrScore(
                                response.getHrScore()
                        )
                        .skillGapScore(
                                response.getSkillGapScore()
                        )
                        .recommendation(
                                response.getRecommendation()
                        )
                        .summary(
                                response.getSummary()
                        )
                        .integrityViolation(false)
                        .violationCount(0)
                        .terminationReason(null)
                        .interviewStatus("COMPLETED")
                        .build();


        interviewResultRepository.save(
                interviewResult
        );


        // =========================================================
        // 22. RETURN FINAL RESULT
        // =========================================================

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

    @Override
    public InterviewEvaluationResponse submitVoiceAnswer(
            Long candidateId,
            Long questionId,
            MultipartFile audio) {

        // =========================================================
        // 1. VALIDATE AUDIO
        // =========================================================

        if (
                audio == null ||
                        audio.isEmpty()
        ) {

            throw new RuntimeException(
                    "Voice recording is empty."
            );
        }


        // =========================================================
        // 2. FIND CANDIDATE
        // =========================================================

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // 3. FIND QUESTION
        // =========================================================

        InterviewQuestion question =
                interviewQuestionRepository
                        .findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview question not found."
                                )
                        );


        // =========================================================
        // 4. VALIDATE OWNERSHIP
        // =========================================================

        if (
                !question
                        .getResume()
                        .getCandidate()
                        .getId()
                        .equals(candidateId)
        ) {

            throw new RuntimeException(
                    "Interview question does not belong to this candidate."
            );
        }


        // =========================================================
        // 5. SERVER-SIDE TRANSCRIPTION
        // =========================================================

        String serverTranscript =
                audioTranscriptionService.transcribe(
                        audio
                );


        // =========================================================
        // 6. VALIDATE TRANSCRIPT
        // =========================================================

        if (
                serverTranscript == null ||
                        serverTranscript.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Could not understand the voice answer. Please try again."
            );
        }


        // =========================================================
        // 7. EVALUATE USING EXISTING AI FLOW
        // =========================================================

        return submitAnswer(
                candidateId,
                questionId,
                serverTranscript.trim()
        );
    }


    @Override
    public InterviewResultResponse terminateInterview(
            Long candidateId,
            Long jobId,
            Integer violationCount,
            String reason) {

        // =========================================================
        // 1. FIND CANDIDATE
        // =========================================================


        if (violationCount == null || violationCount < 1) {
            violationCount = 3;
        }

        if (reason == null || reason.isBlank()) {
            reason =
                    "Interview terminated after reaching the maximum number of security violations.";
        }

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );


        // =========================================================
        // 2. FIND JOB
        // =========================================================

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found."
                                )
                        );


        // =========================================================
        // 3. FIND INTERVIEW QUESTIONS
        // =========================================================

        List<InterviewQuestion> interviewQuestions =
                interviewQuestionRepository
                        .findByResume_Candidate_Id(candidateId)
                        .stream()
                        .filter(question ->
                                question.getJob()
                                        .getId()
                                        .equals(jobId)
                        )
                        .toList();


        if (interviewQuestions.isEmpty()) {

            throw new RuntimeException(
                    "No interview questions found for this candidate and job."
            );
        }


        // =========================================================
        // 4. FIND RESUME USED FOR INTERVIEW
        // =========================================================

        Resume resume =
                interviewQuestions
                        .get(0)
                        .getResume();


        // =========================================================
        // 5. COUNT ANSWERED QUESTIONS
        // =========================================================

        List<InterviewAnswer> candidateAnswers =
                interviewAnswerRepository
                        .findByCandidate(candidate);

        int answeredQuestions =
                (int) candidateAnswers.stream()
                        .filter(answer ->
                                answer.getQuestion()
                                        .getJob()
                                        .getId()
                                        .equals(jobId)
                        )
                        .filter(answer ->
                                answer.getQuestion()
                                        .getResume()
                                        .getId()
                                        .equals(resume.getId())
                        )
                        .count();


        // =========================================================
        // 6. FIND / CREATE INTERVIEW RESULT
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


        // =========================================================
        // 7. SAVE TERMINATED INTERVIEW RESULT
        // =========================================================

        interviewResult.setTotalQuestions(
                interviewQuestions.size()
        );

        interviewResult.setAnsweredQuestions(
                answeredQuestions
        );

        interviewResult.setAverageScore(
                0.0
        );

        interviewResult.setOverallScore(
                0.0
        );

        interviewResult.setTechnicalScore(
                0.0
        );

        interviewResult.setHrScore(
                0.0
        );

        interviewResult.setSkillGapScore(
                0.0
        );

        interviewResult.setRecommendation(
                "REJECT"
        );

        interviewResult.setIntegrityViolation(true);

        interviewResult.setViolationCount(
                violationCount
        );

        interviewResult.setTerminationReason(
                reason
        );

        interviewResult.setInterviewStatus(
                "TERMINATED"
        );

        interviewResult.setSummary(
                "Interview terminated because the maximum "
                        + "allowed proctoring violations were reached. "
                        + "Violation count: "
                        + violationCount
                        + ". Reason: "
                        + reason
        );


        interviewResultRepository.save(
                interviewResult
        );


        // =========================================================
        // 8. REJECT JOB MATCH
        // =========================================================

        JobMatch jobMatch =
                jobMatchRepository
                        .findByJobAndResume(
                                job,
                                resume
                        )
                        .orElse(null);


        if (jobMatch != null) {

            jobMatch.setStatus(
                    MatchStatus.REJECTED
            );

            jobMatchRepository.save(
                    jobMatch
            );
        }


        // =========================================================
        // 9. BUILD RESPONSE
        // =========================================================

        InterviewResultResponse response =
                new InterviewResultResponse();

        response.setCandidateId(
                candidateId
        );

        response.setJobId(
                jobId
        );

        response.setTotalQuestions(
                interviewQuestions.size()
        );

        response.setAnsweredQuestions(
                answeredQuestions
        );

        response.setAverageScore(
                0.0
        );

        response.setOverallScore(
                0.0
        );

        response.setTechnicalScore(
                0.0
        );

        response.setHrScore(
                0.0
        );

        response.setSkillGapScore(
                0.0
        );

        response.setRecommendation(
                "REJECT"
        );

        response.setIntegrityViolation(true);

        response.setViolationCount(
                violationCount
        );

        response.setTerminationReason(
                reason
        );

        response.setInterviewStatus(
                "TERMINATED"
        );

        response.setSummary(
                "Interview terminated due to "
                        + violationCount
                        + " proctoring violations. "
                        + "Reason: "
                        + reason
        );


        return response;
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

    @Override
    public List<InterviewListResponse> getMyInterviews(
            Long candidateId) {

        User candidate =
                userRepository.findById(candidateId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidate not found."
                                )
                        );

        /*
         * Get all interview questions generated
         * for this candidate.
         */
        List<InterviewQuestion> questions =
                interviewQuestionRepository
                        .findByResume_Candidate_Id(
                                candidateId
                        );

        if (questions.isEmpty()) {
            return List.of();
        }

        /*
         * Group questions by Job + Resume.
         *
         * One candidate may have multiple interviews
         * for different jobs/resumes.
         */
        return questions.stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                question ->
                                        question.getJob().getId()
                                                + "_"
                                                + question.getResume().getId()
                        )
                )
                .values()
                .stream()
                .map(interviewQuestions -> {

                    InterviewQuestion firstQuestion =
                            interviewQuestions.get(0);

                    Job job =
                            firstQuestion.getJob();

                    Resume resume =
                            firstQuestion.getResume();

                    /*
                     * Find submitted answers for this candidate.
                     */
                    List<InterviewAnswer> candidateAnswers =
                            interviewAnswerRepository
                                    .findByCandidate(candidate);

                    long answeredCount =
                            candidateAnswers.stream()
                                    .filter(answer ->
                                            answer.getQuestion()
                                                    .getJob()
                                                    .getId()
                                                    .equals(job.getId())
                                    )
                                    .filter(answer ->
                                            answer.getQuestion()
                                                    .getResume()
                                                    .getId()
                                                    .equals(resume.getId())
                                    )
                                    .count();

                    /*
                     * Find final result if it exists.
                     */
                    InterviewResult interviewResult =
                            interviewResultRepository
                                    .findByCandidateAndJob(
                                            candidate,
                                            job
                                    )
                                    .orElse(null);

                    String status;

                    if (interviewResult != null) {

                        status = "COMPLETED";

                    } else if (answeredCount > 0) {

                        status = "IN_PROGRESS";

                    } else {

                        status = "READY";
                    }

                    return InterviewListResponse.builder()

                            .jobId(
                                    job.getId()
                            )

                            .candidateId(
                                    candidateId
                            )

                            .resumeId(
                                    resume.getId()
                            )

                            .jobTitle(
                                    job.getTitle()
                            )

                            .totalQuestions(
                                    interviewQuestions.size()
                            )

                            .status(
                                    status
                            )

                            .overallScore(
                                    interviewResult != null
                                            ? interviewResult
                                            .getOverallScore()
                                            : null
                            )

                            .recommendation(
                                    interviewResult != null
                                            ? interviewResult
                                            .getRecommendation()
                                            : null
                            )

                            .build();
                })
                .toList();
    }
}