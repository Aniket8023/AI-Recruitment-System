package com.airecruitment.match.client;

import com.airecruitment.match.dto.JobMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AiMatchingClient {

    private final ChatClient.Builder chatClientBuilder;

    public JobMatchResponse matchJobWithCandidate(String prompt) {

        ChatClient chatClient = chatClientBuilder.build();

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(JobMatchResponse.class);
    }
}