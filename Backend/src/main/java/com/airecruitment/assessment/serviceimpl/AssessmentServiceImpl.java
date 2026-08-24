package com.airecruitment.assessment.serviceimpl;

import com.airecruitment.assessment.dto.AssessmentResponse;
import com.airecruitment.assessment.entity.Assessment;
import com.airecruitment.assessment.enums.AssessmentStatus;
import com.airecruitment.assessment.enums.AssessmentType;
import com.airecruitment.assessment.repository.AssessmentRepository;
import com.airecruitment.assessment.service.AssessmentService;
import com.airecruitment.job.entity.Job;
import com.airecruitment.job.repository.JobRepository;
import com.airecruitment.match.entity.JobMatch;
import com.airecruitment.match.repository.JobMatchRepository;
import com.airecruitment.resume.entity.Resume;
import com.airecruitment.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;

    private final JobRepository jobRepository;

    private final ResumeRepository resumeRepository;

    private final JobMatchRepository jobMatchRepository;

    @Override
    public AssessmentResponse createAssessment(
            Long jobId,
            Long resumeId
    ) {

        // 1. Find Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found: " + jobId)
                );

        // 2. Find Resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found: " + resumeId)
                );

        // 3. Check whether candidate has a job match
        JobMatch jobMatch = jobMatchRepository
                .findByJobIdAndResumeId(jobId, resumeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidate is not matched with this job."
                        )
                );

        // 4. Check whether assessment already exists
        assessmentRepository
                .findByCandidateAndJob(
                        resume.getCandidate(),
                        job
                )
                .ifPresent(existingAssessment -> {
                    throw new RuntimeException(
                            "Assessment already exists for this candidate and job."
                    );
                });

        // 5. Create Assessment
        Assessment assessment = Assessment.builder()
                .candidate(resume.getCandidate())
                .job(job)
                .resume(resume)
                .type(AssessmentType.MIXED)
                .status(AssessmentStatus.CREATED)
                .totalQuestions(20)
                .durationMinutes(45)
                .build();

        Assessment savedAssessment =
                assessmentRepository.save(assessment);

        // 6. Convert Entity → DTO
        return AssessmentResponse.builder()
                .assessmentId(savedAssessment.getId())
                .candidateId(savedAssessment.getCandidate().getId())
                .jobId(savedAssessment.getJob().getId())
                .resumeId(savedAssessment.getResume().getId())
                .type(savedAssessment.getType())
                .status(savedAssessment.getStatus())
                .totalQuestions(savedAssessment.getTotalQuestions())
                .durationMinutes(savedAssessment.getDurationMinutes())
                .build();
    }
}