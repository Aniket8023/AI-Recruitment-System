package com.airecruitment.resume.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeTextExtractor {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) {

        try {
            return tika.parseToString(file.getInputStream());
        } catch (IOException | TikaException e) {
            throw new RuntimeException(
                    "Failed to extract text from resume", e
            );
        }
    }
}