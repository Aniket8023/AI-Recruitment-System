#         🚀 HireAI - AI-Powered Recruitment System

<p align="center">
  <strong>HireAI</strong> is an intelligent full-stack recruitment platform that connects candidates and recruiters through AI-assisted job matching, assessments, AI interviews, and recruitment analytics.
</p>

<p align="center">
  🌐 <a href="https://hireai-bice.vercel.app">Live Demo</a> •
  📦 <a href="https://github.com/Aniket8023/AI-Recruitment-System">GitHub Repository</a>
</p>

---

## 📌 Overview

HireAI is an AI-powered recruitment platform designed to streamline the complete hiring process, from resume submission and job matching to technical assessment, AI interview, candidate evaluation, and recruiter shortlisting.

The platform provides separate workflows for **Candidates** and **Recruiters**, allowing both sides to manage the recruitment process through a centralized system.

### Core Capabilities

- 👤 Candidate registration and profile management
- 🏢 Recruiter/company profile management
- 💼 Job creation, publishing, closing and archiving
- 📄 Resume upload and AI-powered resume analysis
- 🤖 AI-based job-resume matching
- 📝 AI-generated technical assessments
- 🎤 AI-powered interviews
- 🎙️ Voice-based interview answers
- 🛡️ Interview proctoring and integrity monitoring
- 📊 Candidate evaluation
- ⭐ Candidate shortlisting and rejection
- 📈 Recruiter dashboard and hiring analytics
- 🔐 JWT-based authentication and role-based authorization

---

# ✨ Key Features

## 👨‍💻 Candidate Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure registration and JWT-based login |
| 👤 Profile | Manage personal information and profile |
| 📄 Resume | Upload and manage resumes |
| 🤖 Resume Analysis | Analyze resume content using AI |
| 💼 Job Discovery | Browse available jobs |
| 🎯 AI Job Matching | Match resume skills with job requirements |
| 📩 Applications | Apply for jobs and track application status |
| 📝 Assessment | Attempt AI-generated technical assessments |
| 🎤 AI Interview | Complete AI-generated interview questions |
| 🎙️ Voice Answers | Submit interview answers through voice |
| 🛡️ Proctoring | Detect interview integrity violations |
| 📊 Results | View assessment and interview results |

---

## 🏢 Recruiter Features

| Feature | Description |
|---|---|
| 📊 Dashboard | View jobs, applications and shortlisted candidates |
| 🏢 Company Profile | Manage company information |
| 💼 Job Management | Create, publish, close and archive jobs |
| 👥 Candidate Management | Search and review applicants |
| 🤖 AI Matching | View candidate-job matching information |
| 📊 Candidate Evaluation | Review resume, assessment and interview results |
| ⭐ Shortlisting | Shortlist suitable candidates |
| ❌ Rejection | Reject candidates |
| ⚙️ Settings | Manage account and password |

---

# 🤖 AI Recruitment Workflow

```text
                    ┌─────────────────┐
                    │    Candidate    │
                    └────────┬────────┘
                             │
                             ▼
                    Register / Login
                             │
                             ▼
                       Upload Resume
                             │
                             ▼
                  AI Resume Analysis
                             │
                             ▼
                    Browse Jobs
                             │
                             ▼
                     Apply for Job
                             │
                             ▼
                AI Job-Resume Matching
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
           Match Score   Matched Skills  Skill Gaps
                │
                ▼
             Assessment
                │
                ▼
           AI Interview
                │
          ┌─────┴─────┐
          ▼           ▼
     Text Answers  Voice Answers
          │           │
          └─────┬─────┘
                ▼
          Interview Evaluation
                │
                ▼
         Recruiter Evaluation
                │
          ┌─────┴─────┐
          ▼           ▼
      Shortlist     Reject
```

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React + Vite          │
│          Frontend           │
│                             │
│  Candidate + Recruiter UI   │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│        Spring Boot          │
│          Backend            │
│                             │
│  REST APIs                  │
│  Authentication             │
│  Business Logic             │
│  AI Integration             │
└──────────┬───────────┬──────┘
           │           │
           │           │
           ▼           ▼
┌────────────────┐  ┌──────────────────┐
│  Aiven MySQL   │  │  Google Gemini   │
│    Database    │  │   AI Services    │
└────────────────┘  └──────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 🔗 Axios
- 🎨 CSS
- 🎯 Lucide React

## Backend

- ☕ Java 21
- 🌱 Spring Boot
- 🔐 Spring Security
- 🗄️ Spring Data JPA
- 🛢️ Hibernate
- 🔑 JWT
- 📄 Apache Tika
- 🤖 Spring AI
- ✨ Google Gemini

## Database

- MySQL
- Aiven MySQL

## Deployment

- ▲ Vercel - Frontend
- 🚀 Render - Backend
- ☁️ Aiven - MySQL

---

# 🔐 Authentication & Security

HireAI uses JWT-based authentication and role-based authorization.

### Supported Roles

```text
CANDIDATE
RECRUITER
COMPANY_ADMIN
ADMIN
```

The backend validates the JWT token before allowing access to protected APIs.

Sensitive configuration values are stored using environment variables.

Examples:

```text
DB_PASSWORD
JWT_SECRET
GEMINI_API_KEY
```

> ⚠️ Never commit passwords, API keys, JWT secrets or other credentials to GitHub.

---

# 📂 Project Structure

```text
AI-Recruitment-System/
│
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       └── resources/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── ...
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── candidate/
│   │   │   └── recruiter/
│   │   │
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── candidate/
│   │   │   └── recruiter/
│   │   │
│   │   └── services/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── screenshots/
│
└── README.md
```

---

# 📸 Screenshots

> Screenshots are organized inside `docs/screenshots/`.

## 🔐 Authentication

### Login Page

<img width="1920" height="1080" alt="Screenshot 2026-09-25 144330" src="https://github.com/user-attachments/assets/7c11b05e-20cc-4e24-87ae-50d689f366ed" />


---

## 👨‍💻 Candidate Dashboard

<img width="1920" height="1080" alt="Screenshot 2026-09-25 145515" src="https://github.com/user-attachments/assets/e70d6c3f-fb10-4d9c-9e5c-ec8bebcbd748" />


---

## 💼 Jobs

### Job Listing

<img width="1920" height="1080" alt="Screenshot 2026-09-25 145551" src="https://github.com/user-attachments/assets/cd304faf-672c-4b93-8f90-cd11e2e67394" />


### Job Details

<img width="1920" height="1080" alt="Screenshot 2026-09-25 145622" src="https://github.com/user-attachments/assets/130935a9-091b-4fa8-89cf-71672586f3f0" />


---

## 🤖 AI Job Matching

<img width="1920" height="1080" alt="Screenshot 2026-09-25 145658" src="https://github.com/user-attachments/assets/5c4bbb41-305c-4bd5-96d0-6af0f2264f73" />


---

## 📝 Technical Assessment

<img width="1920" height="1080" alt="Screenshot 2026-09-19 144801" src="https://github.com/user-attachments/assets/8f0e726b-8701-4e4e-b4fe-1f3715907ec9" />


---

## 🎤 AI Interview

<img width="1920" height="1080" alt="Screenshot 2026-09-21 125111" src="https://github.com/user-attachments/assets/201941be-2b24-4831-8935-afeb0d976b20" />


---

## 📊 Interview Result

<img width="1920" height="1080" alt="Screenshot 2026-09-25 145921" src="https://github.com/user-attachments/assets/2ec186c2-7bfc-44e5-b287-8f05697eb586" />


---

## 📊 Interview Result Violation

<img width="1920" height="1080" alt="Screenshot 2026-09-25 150013" src="https://github.com/user-attachments/assets/21785c00-10dd-43fa-90f9-0db386ab7db1" />


## 🏢 Recruiter Dashboard

<img width="1920" height="1080" alt="Screenshot 2026-09-25 150055" src="https://github.com/user-attachments/assets/cdaa5c6d-feb9-4707-bff4-de455f82c995" />


---

## 👥 Recruiter Candidates

<img width="1920" height="1080" alt="Screenshot 2026-09-25 150120" src="https://github.com/user-attachments/assets/e7975199-d55f-4247-b976-fc697ebf91a3" />


---

## ⭐ Shortlisted Candidates

<img width="1920" height="1080" alt="Screenshot 2026-09-25 150323" src="https://github.com/user-attachments/assets/a5c36f0c-4cf1-4d8d-ba67-1313e44316c1" />


---

## 📊 Candidate Evaluation

<img width="1920" height="1080" alt="Screenshot 2026-09-25 150519" src="https://github.com/user-attachments/assets/f0a4f215-8f9f-417f-92e3-9746f462c85d" />


---




# 🔄 Candidate Workflow

```text
Register
   ↓
Login
   ↓
Complete Profile
   ↓
Upload Resume
   ↓
AI Resume Analysis
   ↓
Browse Jobs
   ↓
Apply
   ↓
AI Job Matching
   ↓
Technical Assessment
   ↓
AI Interview
   ↓
Interview Evaluation
   ↓
Application Result
```

---

# 🔄 Recruiter Workflow

```text
Register / Login
       ↓
Company Profile
       ↓
Create Job
       ↓
Publish Job
       ↓
Receive Applications
       ↓
AI Candidate Matching
       ↓
Review Candidate
       ↓
Assessment Result
       ↓
Interview Result
       ↓
Shortlist / Reject
```

---

# ⚙️ Local Setup

## Prerequisites

Make sure you have installed:

- Java 21+
- Maven
- Node.js 18+
- npm
- MySQL

---

## Backend Setup

Clone the repository:

```bash
git clone https://github.com/Aniket8023/AI-Recruitment-System.git
```

Navigate to backend:

```bash
cd AI-Recruitment-System/Backend
```

Build the project:

```bash
mvn clean install
```

Run Spring Boot:

```bash
mvn spring-boot:run
```

Backend will run locally on:

```text
http://localhost:8081
```

---

# 💻 Frontend Setup

Navigate to frontend:

```bash
cd AI-Recruitment-System/Frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run locally on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

Configure the following environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GEMINI_API_KEY
```

Example:

```properties
server.port=${PORT:8081}

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}

spring.ai.google.genai.api-key=${GEMINI_API_KEY}
```

---

## Frontend

Create:

```text
Frontend/.env
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

For production:

```env
VITE_API_BASE_URL=https://ai-recruitment-system-55kd.onrender.com/api/v1
```

> ⚠️ Frontend environment variables are exposed to the browser. Never put private secrets such as database passwords or Gemini API keys in the frontend.

---

# 🚀 Deployment Architecture

```text
                 🌐 User
                    │
                    ▼
        ┌─────────────────────┐
        │      Vercel         │
        │   React + Vite      │
        └──────────┬──────────┘
                   │
                   │ HTTPS REST API
                   ▼
        ┌─────────────────────┐
        │      Render         │
        │   Spring Boot API   │
        └─────────┬───────────┘
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
 ┌────────────────┐  ┌────────────────┐
 │  Aiven MySQL   │  │ Google Gemini  │
 │    Database    │  │       AI       │
 └────────────────┘  └────────────────┘
```

---

# 🌐 Live Application

### Frontend

🔗 https://hireai.vercel.app

### Backend

🔗 https://ai-recruitment-system-55kd.onrender.com

### Source Code

🔗 https://github.com/Aniket8023/AI-Recruitment-System

---

# 🎯 Project Objectives

HireAI was developed with the following objectives:

- Reduce manual effort in candidate screening
- Automate resume and job matching
- Generate structured technical assessments
- Generate AI-based interview questions
- Support voice-based interview answers
- Provide structured candidate evaluation
- Help recruiters review candidates through a centralized dashboard
- Track recruitment progress from application to final decision

---

# 🔮 Future Enhancements

Possible future improvements include:

- 📧 Automated email notifications
- 📅 Interview scheduling
- 📱 Mobile application
- 📊 Advanced recruitment analytics
- 🔔 Real-time notifications
- 📄 Advanced resume parsing
- 👨‍💼 Dedicated admin approval workflow
- 📈 Recruitment funnel analytics
- 🔔 Candidate and recruiter notification center

---

# 👨‍💻 Author

## Aniket Vijay Solanke

**Full Stack Java Developer**

### Connect With Me

- 🐙 GitHub: https://github.com/Aniket8023
- 💼 LinkedIn: Add your LinkedIn URL
- 🌐 Portfolio: Add your portfolio URL

---

# ⭐ Support

If you find HireAI useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Built with ❤️ using React, Spring Boot, MySQL and AI
</p>
