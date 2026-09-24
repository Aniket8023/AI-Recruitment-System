package com.airecruitment.ai.service;

import org.springframework.web.multipart.MultipartFile;

public interface AudioTranscriptionService {

    String transcribe(
            MultipartFile audio
    );
}