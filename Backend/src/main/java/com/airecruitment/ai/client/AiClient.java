package com.airecruitment.ai.client;

import com.airecruitment.ai.dto.JobAnalysisResponse;
import com.airecruitment.assessment.dto.AIQuestionResponse;
import com.airecruitment.assessment.dto.AIQuestionsResponse;
import com.airecruitment.interview.dto.InterviewEvaluationResponse;
import com.airecruitment.interview.dto.InterviewQuestionsResponse;
import com.airecruitment.resume.dto.ResumeAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AiClient {

    private final ChatClient.Builder chatClientBuilder;

    public JobAnalysisResponse analyzeJob(String prompt) {

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(JobAnalysisResponse.class);
    }

    public ResumeAnalysisResponse analyzeResume(String prompt) {

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(ResumeAnalysisResponse.class);
    }

    public InterviewQuestionsResponse generateInterviewQuestions(
            String prompt,
            Long jobId,
            Long candidateId,
            Long resumeId,
            String jobTitle
    ) {

        ChatClient chatClient = chatClientBuilder.build();

        InterviewQuestionsResponse aiResponse =
                chatClient
                        .prompt()
                        .user(prompt)
                        .call()
                        .entity(InterviewQuestionsResponse.class);

        aiResponse.setJobId(jobId);
        aiResponse.setCandidateId(candidateId);
        aiResponse.setResumeId(resumeId);
        aiResponse.setJobTitle(jobTitle);

        return aiResponse;
    }

    public InterviewEvaluationResponse evaluateInterviewAnswer(
            String prompt
    ) {

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(InterviewEvaluationResponse.class);
    }

    /**
     * Generate ALL assessment questions in ONE Gemini API call.
     */
    public AIQuestionsResponse generateQuestions(
            String prompt
    ) {

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(AIQuestionsResponse.class);
    }
}