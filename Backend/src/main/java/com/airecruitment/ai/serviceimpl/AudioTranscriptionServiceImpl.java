package com.airecruitment.ai.serviceimpl;

import com.airecruitment.ai.service.AudioTranscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AudioTranscriptionServiceImpl
        implements AudioTranscriptionService {

    private final ChatClient.Builder chatClientBuilder;

    @Override
    public String transcribe(
            MultipartFile audio) {

        try {

            // =====================================================
            // 1. VALIDATE AUDIO
            // =====================================================

            if (audio == null || audio.isEmpty()) {

                throw new RuntimeException(
                        "Audio file is empty."
                );
            }


            // =====================================================
            // 2. READ AUDIO BYTES
            // =====================================================

            byte[] audioData =
                    audio.getBytes();


            // =====================================================
            // 3. GET MIME TYPE
            // =====================================================

            String contentType =
                    audio.getContentType();


            if (contentType == null ||
                    contentType.isBlank()) {

                contentType =
                        "audio/webm";
            }


            // =====================================================
            // 4. CREATE MIME TYPE
            // =====================================================

            var mimeType =
                    MimeTypeUtils.parseMimeType(
                            contentType
                    );


            // =====================================================
            // 5. CONVERT BYTE[] TO RESOURCE
            // =====================================================

            ByteArrayResource audioResource =
                    new ByteArrayResource(audioData) {

                        @Override
                        public String getFilename() {
                            return "voice-answer.webm";
                        }
                    };


            // =====================================================
            // 6. CREATE MEDIA
            // =====================================================

            Media audioMedia =
                    new Media(
                            mimeType,
                            audioResource
                    );


            // =====================================================
            // 7. CREATE USER MESSAGE
            // =====================================================

            UserMessage userMessage =
                    UserMessage.builder()

                            .text("""
                                    You are a professional
                                    speech-to-text transcription
                                    system.

                                    Transcribe the candidate's
                                    spoken answer exactly.

                                    Rules:

                                    1. Return ONLY the transcript.
                                    2. Do not add explanations.
                                    3. Do not summarize.
                                    4. Do not evaluate the answer.
                                    5. Preserve the candidate's
                                       intended meaning.
                                    6. Remove obvious filler sounds
                                       such as "um", "uh", and
                                       unnecessary pauses.
                                    7. If the candidate speaks
                                       English with an Indian accent,
                                       accurately recognize the words.
                                    """)

                            .media(
                                    java.util.List.of(
                                            audioMedia
                                    )
                            )

                            .build();


            // =====================================================
            // 8. CREATE CHAT CLIENT
            // =====================================================

            ChatClient chatClient =
                    chatClientBuilder.build();


            // =====================================================
            // 9. SEND AUDIO TO GEMINI
            // =====================================================

            ChatResponse response =
                    chatClient
                            .prompt(
                                    new Prompt(
                                            userMessage
                                    )
                            )
                            .call()
                            .chatResponse();


            // =====================================================
            // 10. VALIDATE AI RESPONSE
            // =====================================================

            if (response == null ||
                    response.getResult() == null ||
                    response
                            .getResult()
                            .getOutput() == null) {

                throw new RuntimeException(
                        "Gemini returned an empty transcription."
                );
            }


            // =====================================================
            // 11. GET TRANSCRIPT
            // =====================================================

            String transcript =
                    response
                            .getResult()
                            .getOutput()
                            .getText();


            // =====================================================
            // 12. VALIDATE TRANSCRIPT
            // =====================================================

            if (transcript == null ||
                    transcript.trim().isEmpty()) {

                throw new RuntimeException(
                        "Could not transcribe the voice answer."
                );
            }


            // =====================================================
            // 13. RETURN TRANSCRIPT
            // =====================================================

            return transcript.trim();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Voice transcription failed.",
                    exception
            );
        }
    }
}