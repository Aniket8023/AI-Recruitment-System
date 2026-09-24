package com.airecruitment.resume.controller;

import com.airecruitment.resume.dto.ResumeAnalysisResponse;
import com.airecruitment.resume.dto.ResumeFileResponse;
import com.airecruitment.resume.dto.ResumeResponse;
import com.airecruitment.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping(
            value = "/upload",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<String> uploadResume(
            @RequestParam Long candidateId,
            @RequestParam("file") MultipartFile file) {

        String response =
                resumeService.uploadResume(candidateId, file);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{resumeId}/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                resumeService.analyzeResume(resumeId)
        );
    }

    @GetMapping("/{resumeId}/analysis")
    public ResponseEntity<ResumeAnalysisResponse> getResumeAnalysis(
            @PathVariable Long resumeId) {

        return ResponseEntity.ok(
                resumeService.getResumeAnalysis(resumeId)
        );
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ResumeResponse>> getMyResumes(
            @PathVariable Long candidateId) {

        return ResponseEntity.ok(
                resumeService.getMyResumes(candidateId)
        );
    }

    @GetMapping("/{resumeId}/file")
    public ResponseEntity<byte[]> getResumeFile(
            @PathVariable Long resumeId) {

        ResumeFileResponse resumeFile =
                resumeService.getResumeFile(resumeId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                resumeFile.getFileName() +
                                "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                resumeFile.getFileType()
                        )
                )
                .body(resumeFile.getFileData());
    }
}