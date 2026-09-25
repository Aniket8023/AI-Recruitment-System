🚀 HireAI - AI-Powered Recruitment System

<p align="center">
  <strong>HireAI</strong> is an intelligent full-stack recruitment platform that connects candidates and recruiters through AI-assisted job matching, assessments, AI interviews, and recruitment analytics.
</p>

<p align="center">
  🌐 <a href="https://hireai.vercel.app">Live Demo</a> •
  📦 <a href="https://github.com/Aniket8023/AI-Recruitment-System">GitHub Repository</a>
</p>

📌 Overview

HireAI streamlines the recruitment lifecycle from resume submission and job matching to technical assessment, AI interview, candidate evaluation, and recruiter shortlisting.

Core capabilities

👤 Candidate registration, authentication and profile management

🏢 Recruiter/company profile management

💼 Job creation, publishing, closing and archiving

📄 Resume upload and AI-powered resume analysis

🤖 AI-based job-resume matching

📝 AI-generated technical assessments

🎤 AI-powered interview with voice-answer support

🛡️ Interview proctoring and integrity monitoring

📊 Candidate evaluation and recruitment progress tracking

⭐ Recruiter shortlisting and rejection workflow

📈 Recruiter dashboard and hiring analytics

🔐 JWT authentication and role-based authorization

✨ Key Features

👨‍💻 Candidate

Feature

Description

Authentication

Secure registration and JWT-based login

Profile

Manage personal information

Resume

Upload and manage resumes

Resume Analysis

Extract and analyze resume information

Job Discovery

Browse published jobs

AI Job Matching

Compare candidate resume with job requirements

Applications

Apply for jobs and track application status

Assessment

Attempt AI-generated technical questions

AI Interview

Complete generated interview questions

Voice Answers

Submit interview answers through voice

Proctoring

Detect interview integrity violations

Results

View assessment and interview results

🏢 Recruiter

Feature

Description

Dashboard

View jobs, applications and shortlisted candidates

Company Profile

Manage company information

Job Management

Create, publish, close and archive jobs

Candidate Management

Search and review applicants

AI Matching

Review match score and skill analysis

Candidate Evaluation

Review resume, assessment and interview results

Shortlisting

Shortlist candidates

Rejection

Reject candidates

Settings

Manage account and password

🤖 AI Recruitment Flow

Candidate
   │
   ├── Register / Login
   ├── Upload Resume
   └── Resume Analysis
            │
            ▼
     AI Resume Understanding
            │
            ▼
      Apply for Published Job
            │
            ▼
     AI Job ↔ Resume Matching
            │
            ├── Match Score
            ├── Matched Skills
            ├── Missing Skills
            ├── Strengths
            └── Skill Gaps
            │
            ▼
      Technical Assessment
            │
            ▼
         AI Interview
            │
            ├── Text Answers
            ├── Voice Answers
            └── Proctoring
            │
            ▼
       Final Evaluation
            │
            ▼
      Recruiter Review
         ┌──┴──┐
         ▼     ▼
     Shortlist Reject

🏗️ System Architecture

┌──────────────────────┐
│     React + Vite     │
│       Frontend       │
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────┐
│     Spring Boot      │
│       Backend        │
└───────┬────────┬─────┘
        │        │
        ▼        ▼
┌────────────┐ ┌────────────────┐
│ Aiven      │ │ Google Gemini  │
│ MySQL      │ │ AI Services    │
└────────────┘ └────────────────┘

🛠️ Technology Stack

Frontend

React

Vite

React Router

Axios

Lucide React

CSS

Backend

Java 21

Spring Boot

Spring Security

Spring Data JPA

Hibernate

JWT

Apache Tika

Spring AI / Google Gemini

Database

MySQL

Aiven MySQL

Deployment

Vercel - Frontend

Render - Backend

Aiven - MySQL

🔐 Security

HireAI uses JWT-based authentication and role-based access control.

Roles

CANDIDATE
RECRUITER
COMPANY_ADMIN
ADMIN

Sensitive values such as DB_PASSWORD, JWT_SECRET, and GEMINI_API_KEY are stored through environment variables and must never be committed to GitHub.

📂 Project Structure

AI-Recruitment-System/
│
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── Dockerfile
│   ├── pom.xml
│   └── ...
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

🖥️ Screenshots

Create this folder in the repository:

docs/screenshots/

Recommended screenshots:

1. Login / Landing Page



2. Candidate Dashboard



3. Jobs Listing



4. Job Details



5. AI Job Matching



6. Assessment



7. AI Interview



8. Interview Result



9. Recruiter Dashboard



10. Recruiter Candidates / AI Evaluation



11. Shortlisted Candidates



12. Candidate Evaluation



For the GitHub README, 8-10 strong screenshots are usually enough. Prioritize the Candidate Dashboard, AI Matching, Assessment, AI Interview, Recruiter Dashboard, Candidate Evaluation and Shortlisted Candidates.

🔄 Candidate Workflow

Register → Login → Profile → Upload Resume
        → AI Resume Analysis → Browse Jobs
        → Apply → AI Job Matching
        → Assessment → AI Interview
        → Evaluation → Application Result

🔄 Recruiter Workflow

Login → Company Profile → Create Job → Publish
     → Receive Applications → AI Candidate Matching
     → Review Candidate → Assessment Result
     → Interview Result → Shortlist / Reject

⚙️ Local Setup

Prerequisites

Java 21+

Maven

Node.js 18+

npm

MySQL

Backend

cd Backend
mvn clean install
mvn spring-boot:run

Local backend:

http://localhost:8081

Frontend

cd Frontend
npm install
npm run dev

Local frontend:

http://localhost:5173

🔑 Environment Variables

Backend

Configure:

DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GEMINI_API_KEY

Frontend

Create Frontend/.env:

VITE_API_BASE_URL=http://localhost:8081/api/v1

Production:

VITE_API_BASE_URL=https://ai-recruitment-system-55kd.onrender.com/api/v1

Never commit secret .env files.

🚀 Deployment

React + Vite
     │
     ▼
  Vercel
     │
     ▼
Spring Boot API
     │
     ├──────────► Google Gemini
     │
     ▼
Aiven MySQL

Live URLs

Frontend: https://hireai.vercel.app

Backend: https://ai-recruitment-system-55kd.onrender.com

🎯 Project Objectives

Reduce manual effort in candidate screening

Automate resume and job matching

Generate structured assessments and interview questions

Provide consistent candidate evaluation

Give recruiters a centralized candidate review workflow

Track recruitment progress from application to final decision

🔮 Future Enhancements

📧 Automated email notifications

📅 Interview scheduling

📱 Mobile application

📊 Advanced recruitment analytics

🔔 Real-time notifications

📄 More advanced resume parsing

👨‍💼 Dedicated admin approval workflow

📈 Recruitment funnel analytics

👨‍💻 Author

Aniket Vijay Solanke

Full Stack Java Developer

GitHub: https://github.com/Aniket8023

LinkedIn: Add your LinkedIn profile

Portfolio: Add your portfolio URL

⭐ Support

If you find HireAI useful, consider giving the repository a ⭐.

<p align="center">
  Built with ❤️ using React, Spring Boot, MySQL and AI
</p>
