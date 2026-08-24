package com.airecruitment.resume.serviceimpl;

import com.airecruitment.ai.client.AiClient;
import com.airecruitment.resume.dto.ResumeAnalysisResponse;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.entity.ResumeAnalysis;
import com.airecruitment.resume.repository.ResumeAnalysisRepository;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.resume.service.ResumeService;
import com.airecruitment.resume.service.ResumeTextExtractor;
import com.airecruitment.user.entity.User;
import com.airecruitment.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;

    private final UserRepository userRepository;

    private final ResumeTextExtractor resumeTextExtractor;

    private final ResumeAnalysisRepository resumeAnalysisRepository;

    private final AiClient aiClient;

    @Override
    public String uploadResume(Long candidateId, MultipartFile file) {

        // 1. Validate file
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required.");
        }

        // 2. Validate file type
        String contentType = file.getContentType();

        if (contentType == null ||
                (!contentType.equals("application/pdf")
                        && !contentType.equals(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {

            throw new RuntimeException(
                    "Only PDF and DOCX resumes are supported."
            );
        }

        // 3. Find candidate
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidate not found with id: " + candidateId
                        )
                );

        // 4. Extract text
        String extractedText =
                resumeTextExtractor.extractText(file);

        if (extractedText == null ||
                extractedText.trim().isEmpty()) {

            throw new RuntimeException(
                    "Could not extract text from resume."
            );
        }

        // 5. Create Resume entity
        Resume resume = Resume.builder()
                .candidate(candidate)
                .fileName(file.getOriginalFilename())
                .fileType(contentType)
                .extractedText(extractedText)
                .build();

        // 6. Save
        resumeRepository.save(resume);

        return "Resume uploaded successfully. Resume ID: "
                + resume.getId();
    }

    @Override
    @Transactional
    public ResumeAnalysisResponse analyzeResume(Long resumeId) {

        // 1. Get resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found with id: " + resumeId
                        )
                );

        // 2. Build AI prompt
        String prompt = buildResumeAnalysisPrompt(resume);

        // 3. Send to Gemini
        ResumeAnalysisResponse response =
                aiClient.analyzeResume(prompt);

        // 4. Set IDs from database
        response.setResumeId(resume.getId());
        response.setCandidateId(resume.getCandidate().getId());

        // 5. Find existing analysis or create new
        ResumeAnalysis analysis =
                resumeAnalysisRepository
                        .findByResumeId(resumeId)
                        .orElse(new ResumeAnalysis());

        analysis.setResume(resume);
        analysis.setCandidateName(response.getCandidateName());
        analysis.setExperienceLevel(response.getExperienceLevel());
        analysis.setTechnicalSkills(response.getTechnicalSkills());
        analysis.setSoftSkills(response.getSoftSkills());
        analysis.setEducation(response.getEducation());
        analysis.setProjects(response.getProjects());
        analysis.setCertifications(response.getCertifications());
        analysis.setSummary(response.getSummary());

        // 6. Save analysis
        resumeAnalysisRepository.save(analysis);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeAnalysisResponse getResumeAnalysis(Long resumeId) {

        ResumeAnalysis analysis =
                resumeAnalysisRepository
                        .findByResumeId(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume analysis not found for resume id: "
                                                + resumeId
                                )
                        );

        ResumeAnalysisResponse response =
                new ResumeAnalysisResponse();

        response.setResumeId(analysis.getResume().getId());
        response.setCandidateId(
                analysis.getResume().getCandidate().getId()
        );
        response.setCandidateName(
                analysis.getCandidateName()
        );
        response.setExperienceLevel(
                analysis.getExperienceLevel()
        );
        response.setTechnicalSkills(
                analysis.getTechnicalSkills()
        );
        response.setSoftSkills(
                analysis.getSoftSkills()
        );
        response.setEducation(
                analysis.getEducation()
        );
        response.setProjects(
                analysis.getProjects()
        );
        response.setCertifications(
                analysis.getCertifications()
        );
        response.setSummary(
                analysis.getSummary()
        );

        return response;
    }

    private String buildResumeAnalysisPrompt(Resume resume) {

        return """
                You are an expert technical recruiter and resume
                analysis AI.

                Analyze the following resume carefully.

                RESUME TEXT:
                %s

                Extract only information that is actually present
                in the resume.

                Return a structured response containing:

                1. candidateName
                2. experienceLevel
                3. technicalSkills
                4. softSkills
                5. education
                6. projects
                7. certifications
                8. summary

                technicalSkills should contain programming languages,
                frameworks, databases, tools, cloud technologies,
                development technologies and other technical skills.

                softSkills should contain behavioral and professional
                skills.

                education should contain degrees, courses and
                educational qualifications.

                projects should contain projects explicitly mentioned
                in the resume.

                certifications should contain certifications explicitly
                mentioned in the resume.

                experienceLevel should describe the candidate's level,
                such as Fresher, 0-1 years, 1-3 years, etc.

                Do not invent information.

                If a particular category is not present, return an
                empty list.

                Return only structured data.
                """.formatted(
                resume.getExtractedText()
        );
    }
}