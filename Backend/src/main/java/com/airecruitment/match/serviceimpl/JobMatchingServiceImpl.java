package com.airecruitment.match.serviceimpl;

import com.airecruitment.common.enums.MatchStatus;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.match.client.AiMatchingClient;
import com.airecruitment.match.dto.CandidateDetailResponse;
import com.airecruitment.match.dto.CandidateRankingResponse;
import com.airecruitment.match.dto.JobMatchResponse;
import com.airecruitment.match.dto.RecruiterDashboardResponse;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.match.repository.JobMatchRepository;
import com.airecruitment.match.service.JobMatchingService;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.entity.ResumeAnalysis;
import com.airecruitment.resume.repository.ResumeAnalysisRepository;
import com.airecruitment.resume.repository.ResumeRepository;
import com.airecruitment.user.entity.User;
import com.google.genai.types.Candidate;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobMatchingServiceImpl
        implements JobMatchingService {

    private final JobRepository jobRepository;

    private final ResumeRepository resumeRepository;

    private final ResumeAnalysisRepository resumeAnalysisRepository;

    private final JobMatchRepository jobMatchRepository;

    private final AiMatchingClient aiMatchingClient;


    @Override
    @Transactional
    public JobMatchResponse matchJobWithResume(
            Long jobId,
            Long resumeId) {

        System.out.println("=================================");
        System.out.println("STARTING JOB MATCHING");
        System.out.println("Job ID    : " + jobId);
        System.out.println("Resume ID : " + resumeId);
        System.out.println("=================================");


        // 1. Find Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found with id: " + jobId
                        )
                );


        // 2. Find Resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resume not found with id: " + resumeId
                        )
                );


        // 3. Find Resume AI Analysis
        ResumeAnalysis resumeAnalysis =
                resumeAnalysisRepository
                        .findByResumeId(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume analysis not found for resume id: "
                                                + resumeId
                                )
                        );


        // 4. Build AI Prompt
        String prompt =
                buildMatchingPrompt(
                        job,
                        resumeAnalysis
                );


        // 5. Call Gemini
        JobMatchResponse response =
                aiMatchingClient
                        .matchJobWithCandidate(prompt);


        System.out.println("AI MATCH SCORE: "
                + response.getMatchScore());


        // 6. Set IDs
        response.setJobId(jobId);

        response.setResumeId(resumeId);

        response.setCandidateId(
                resumeAnalysis
                        .getResume()
                        .getCandidate()
                        .getId()
        );

        response.setJobTitle(
                job.getTitle()
        );


        // 7. SAVE MATCH RESULT
        saveMatchResult(
                job,
                resume,
                response
        );


        System.out.println("MATCH RESULT SAVED SUCCESSFULLY");


        // 8. Return response
        return response;
    }


    private void saveMatchResult(
            Job job,
            Resume resume,
            JobMatchResponse response) {

        System.out.println(
                "Saving JobMatch into database..."
        );


        // Check whether match already exists
        JobMatch jobMatch =
                jobMatchRepository
                        .findByJobAndResume(
                                job,
                                resume
                        )
                        .orElse(
                                JobMatch.builder()
                                        .job(job)
                                        .resume(resume)
                                        .build()
                        );


        // Set basic information
        jobMatch.setMatchScore(
                response.getMatchScore()
        );

        jobMatch.setRecommendation(
                response.getRecommendation()
        );


        // Technical skills
        if (response.getMatchedTechnicalSkills() != null) {

            jobMatch.setMatchedTechnicalSkills(
                    String.join(
                            ", ",
                            response.getMatchedTechnicalSkills()
                    )
            );
        }


        if (response.getMissingTechnicalSkills() != null) {

            jobMatch.setMissingTechnicalSkills(
                    String.join(
                            ", ",
                            response.getMissingTechnicalSkills()
                    )
            );
        }


        // Soft skills
        if (response.getMatchedSoftSkills() != null) {

            jobMatch.setMatchedSoftSkills(
                    String.join(
                            ", ",
                            response.getMatchedSoftSkills()
                    )
            );
        }


        // Strengths
        if (response.getStrengths() != null) {

            jobMatch.setStrengths(
                    String.join(
                            ", ",
                            response.getStrengths()
                    )
            );
        }


        // Skill gaps
        if (response.getSkillGaps() != null) {

            jobMatch.setSkillGaps(
                    String.join(
                            ", ",
                            response.getSkillGaps()
                    )
            );
        }


        // Explanation
        jobMatch.setExplanation(
                response.getExplanation()
        );


        // SAVE
        JobMatch savedMatch =
                jobMatchRepository.save(jobMatch);


        System.out.println(
                "JobMatch DB ID: "
                        + savedMatch.getId()
        );
    }


    @Override
    public List<CandidateRankingResponse> getRankedCandidates(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        List<JobMatch> matches =
                jobMatchRepository.findByJobOrderByMatchScoreDesc(job);

        List<CandidateRankingResponse> result = new ArrayList<>();

        int rank = 1;

        for (JobMatch match : matches) {

            User candidate = match.getResume().getCandidate();

            CandidateRankingResponse response =
                    CandidateRankingResponse.builder()
                            .rank(rank++)
                            .candidateId(candidate.getId())
                            .resumeId(match.getResume().getId())
                            .candidateName(candidate.getFullName())
                            .email(candidate.getEmail())
                            .matchScore(match.getMatchScore())
                            .recommendation(match.getRecommendation())
                            .explanation(match.getExplanation())
                            .build();

            result.add(response);
        }

        return result;
    }

    @Override
    public CandidateDetailResponse getCandidateDetails(
            Long jobId,
            Long resumeId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found.")
                );

        JobMatch jobMatch = jobMatchRepository
                .findByJobAndResume(job, resume)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job match not found for this job and resume."
                        )
                );

        User candidate = resume.getCandidate();

        return CandidateDetailResponse.builder()
                .candidateId(candidate.getId())
                .resumeId(resume.getId())
                .candidateName(candidate.getFullName())
                .email(candidate.getEmail())
                .jobTitle(job.getTitle())
                .matchScore(jobMatch.getMatchScore())
                .recommendation(jobMatch.getRecommendation())
                .status(jobMatch.getStatus().name())
                .matchedTechnicalSkills(
                        jobMatch.getMatchedTechnicalSkills()
                )
                .missingTechnicalSkills(
                        jobMatch.getMissingTechnicalSkills()
                )
                .matchedSoftSkills(
                        jobMatch.getMatchedSoftSkills()
                )
                .strengths(
                        jobMatch.getStrengths()
                )
                .skillGaps(
                        jobMatch.getSkillGaps()
                )
                .explanation(
                        jobMatch.getExplanation()
                )
                .build();
    }

    @Override
    public void shortlistCandidate(
            Long jobId,
            Long resumeId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found.")
                );

        JobMatch jobMatch = jobMatchRepository
                .findByJobAndResume(job, resume)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job match not found."
                        )
                );

        jobMatch.setStatus(MatchStatus.SHORTLISTED);

        jobMatchRepository.save(jobMatch);
    }

    @Override
    public void rejectCandidate(
            Long jobId,
            Long resumeId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found.")
                );

        JobMatch jobMatch = jobMatchRepository
                .findByJobAndResume(job, resume)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job match not found."
                        )
                );

        jobMatch.setStatus(MatchStatus.REJECTED);

        jobMatchRepository.save(jobMatch);
    }


    @Override
    public List<CandidateRankingResponse> getCandidatesByStatus(
            Long jobId,
            MatchStatus status) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        List<JobMatch> matches =
                jobMatchRepository
                        .findByJobAndStatusOrderByMatchScoreDesc(
                                job,
                                status
                        );

        List<CandidateRankingResponse> result =
                new ArrayList<>();

        int rank = 1;

        for (JobMatch match : matches) {

            User candidate =
                    match.getResume().getCandidate();

            CandidateRankingResponse response =
                    CandidateRankingResponse.builder()
                            .rank(rank++)
                            .candidateId(candidate.getId())
                            .resumeId(match.getResume().getId())
                            .candidateName(candidate.getFullName())
                            .email(candidate.getEmail())
                            .matchScore(match.getMatchScore())
                            .recommendation(match.getRecommendation())
                            .explanation(match.getExplanation())
                            .build();

            result.add(response);
        }

        return result;
    }

    @Override
    public RecruiterDashboardResponse getDashboardSummary(
            Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found.")
                );

        List<JobMatch> matches =
                jobMatchRepository
                        .findByJobOrderByMatchScoreDesc(job);

        long totalCandidates = matches.size();

        long pendingCandidates =
                matches.stream()
                        .filter(match ->
                                match.getStatus()
                                        == MatchStatus.PENDING)
                        .count();

        long shortlistedCandidates =
                matches.stream()
                        .filter(match ->
                                match.getStatus()
                                        == MatchStatus.SHORTLISTED)
                        .count();

        long rejectedCandidates =
                matches.stream()
                        .filter(match ->
                                match.getStatus()
                                        == MatchStatus.REJECTED)
                        .count();

        double averageMatchScore =
                matches.stream()
                        .mapToDouble(JobMatch::getMatchScore)
                        .average()
                        .orElse(0.0);

        long strongMatches =
                matches.stream()
                        .filter(match ->
                                "STRONG_MATCH".equalsIgnoreCase(
                                        match.getRecommendation()
                                ))
                        .count();

        return RecruiterDashboardResponse.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .totalCandidates(totalCandidates)
                .pendingCandidates(pendingCandidates)
                .shortlistedCandidates(shortlistedCandidates)
                .rejectedCandidates(rejectedCandidates)
                .averageMatchScore(
                        Math.round(averageMatchScore * 100.0) / 100.0
                )
                .strongMatches(strongMatches)
                .build();
    }

    private String buildMatchingPrompt(
            Job job,
            ResumeAnalysis resume) {

        return """
                You are an expert AI recruitment matching engine.

                Compare the JOB REQUIREMENTS with the CANDIDATE
                RESUME ANALYSIS.

                ==========================
                JOB
                ==========================

                Job Title:
                %s

                Required Skills:
                %s

                Preferred Skills:
                %s

                Experience Required:
                %s

                ==========================
                CANDIDATE
                ==========================

                Candidate Name:
                %s

                Experience Level:
                %s

                Technical Skills:
                %s

                Soft Skills:
                %s

                Education:
                %s

                Projects:
                %s

                Certifications:
                %s

                Summary:
                %s

                ==========================
                MATCHING RULES
                ==========================

                Calculate a realistic match score between 0 and 100.

                Consider:

                1. Required technical skills
                2. Preferred skills
                3. Candidate experience
                4. Soft skills
                5. Projects
                6. Education
                7. Certifications

                matchedTechnicalSkills should contain technical
                skills required by the job that the candidate has.

                missingTechnicalSkills should contain important
                technical skills required by the job that the
                candidate does not have.

                matchedSoftSkills should contain soft skills relevant
                to the job that are present in the candidate profile.

                strengths should contain the candidate's strongest
                areas for this particular job.

                skillGaps should contain the most important missing
                skills.

                recommendation must be one of:

                STRONG_MATCH
                GOOD_MATCH
                PARTIAL_MATCH
                NOT_RECOMMENDED

                Use these general score ranges:

                80-100 = STRONG_MATCH
                65-79 = GOOD_MATCH
                40-64 = PARTIAL_MATCH
                0-39 = NOT_RECOMMENDED

                Do not invent candidate skills.

                Return only structured data.
                """.formatted(

                job.getTitle(),

                job.getRequiredSkills(),

                job.getPreferredSkills(),

                job.getExperienceRequired(),

                resume.getCandidateName(),

                resume.getExperienceLevel(),

                resume.getTechnicalSkills(),

                resume.getSoftSkills(),

                resume.getEducation(),

                resume.getProjects(),

                resume.getCertifications(),

                resume.getSummary()
        );
    }
}