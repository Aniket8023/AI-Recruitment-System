package com.airecruitment.resume.repository;

import com.airecruitment.resume.entity.Resume;
import com.airecruitment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByCandidate(User candidate);
}