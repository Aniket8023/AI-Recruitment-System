package com.airecruitment.ai.serviceimpl;

import com.airecruitment.ai.client.AiClient;
import com.airecruitment.ai.dto.JobAnalysisResponse;
import com.airecruitment.ai.entity.JobAnalysis;
import com.airecruitment.ai.repository.JobAnalysisRepository;
import com.airecruitment.ai.service.AiJobService;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AiJobServiceImpl implements AiJobService {

    private final JobRepository jobRepository;

    private final AiClient aiClient;

    private final JobAnalysisRepository jobAnalysisRepository;

    @Override
    @Transactional
    public JobAnalysisResponse analyzeJob(Long jobId) {

        // 1. Get job from database
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found with id: " + jobId)
                );

        // 2. Build AI prompt
        String prompt = buildJobAnalysisPrompt(job);

        // 3. Send prompt to Gemini
        JobAnalysisResponse response =
                aiClient.analyzeJob(prompt);

        // 4. Set actual Job ID
        response.setJobId(job.getId());

        // 5. Save AI analysis into database
        JobAnalysis jobAnalysis = jobAnalysisRepository
                .findByJobId(jobId)
                .orElse(new JobAnalysis());

        jobAnalysis.setJob(job);
        jobAnalysis.setJobTitle(response.getJobTitle());
        jobAnalysis.setExperienceLevel(response.getExperienceLevel());
        jobAnalysis.setTechnicalSkills(response.getTechnicalSkills());
        jobAnalysis.setPreferredSkills(response.getPreferredSkills());
        jobAnalysis.setSoftSkills(response.getSoftSkills());
        jobAnalysis.setCoreCompetencies(response.getCoreCompetencies());
        jobAnalysis.setDifficultyLevel(response.getDifficultyLevel());

        jobAnalysisRepository.save(jobAnalysis);

        // 6. Return response
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public JobAnalysisResponse getJobAnalysis(Long jobId) {

        JobAnalysis jobAnalysis = jobAnalysisRepository
                .findByJobId(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "AI analysis not found for job id: " + jobId
                        )
                );

        JobAnalysisResponse response = new JobAnalysisResponse();

        response.setJobId(jobAnalysis.getJob().getId());
        response.setJobTitle(jobAnalysis.getJobTitle());
        response.setExperienceLevel(jobAnalysis.getExperienceLevel());
        response.setTechnicalSkills(jobAnalysis.getTechnicalSkills());
        response.setPreferredSkills(jobAnalysis.getPreferredSkills());
        response.setSoftSkills(jobAnalysis.getSoftSkills());
        response.setCoreCompetencies(jobAnalysis.getCoreCompetencies());
        response.setDifficultyLevel(jobAnalysis.getDifficultyLevel());

        return response;
    }

    private String buildJobAnalysisPrompt(Job job) {

        return """
                You are an expert technical recruiter and job analysis AI.

                Analyze the following job description.

                JOB ID:
                %s

                JOB TITLE:
                %s

                JOB DESCRIPTION:
                %s

                REQUIRED SKILLS:
                %s

                PREFERRED SKILLS:
                %s

                EXPERIENCE:
                %s

                LOCATION:
                %s

                EMPLOYMENT TYPE:
                %s

                WORK MODE:
                %s

                Analyze this job carefully.

                Return a structured response containing:

                1. jobTitle
                2. experienceLevel
                3. technicalSkills
                4. preferredSkills
                5. softSkills
                6. coreCompetencies
                7. difficultyLevel

                technicalSkills should contain only technical skills
                relevant to this job.

                softSkills should contain behavioral/professional skills.

                coreCompetencies should describe the major capabilities
                required to perform this job.

                difficultyLevel must be one of:
                BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

                Do not invent technologies that are unrelated to the
                provided job description.
                """.formatted(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequiredSkills(),
                job.getPreferredSkills(),
                job.getExperienceRequired(),
                job.getLocation(),
                job.getEmploymentType(),
                job.getWorkMode()
        );
    }
}