# 🚀 HireAI - AI-Powered Recruitment System

<p align="center">
  <strong>HireAI</strong> is an intelligent full-stack recruitment platform that connects candidates and recruiters through AI-assisted job matching, assessments, AI interviews, and recruitment analytics.
</p>

<p align="center">
  🌐 <a href="https://hireai.vercel.app">Live Demo</a> •
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

![HireAI Login](docs/screenshots/01-login.png)

---

## 👨‍💻 Candidate Dashboard

![Candidate Dashboard](docs/screenshots/02-candidate-dashboard.png)

---

## 💼 Jobs

### Job Listing

![Jobs Listing](docs/screenshots/03-jobs.png)

### Job Details

![Job Details](docs/screenshots/04-job-details.png)

---

## 🤖 AI Job Matching

![AI Job Matching](docs/screenshots/05-ai-job-matching.png)

---

## 📝 Technical Assessment

![Assessment](docs/screenshots/06-assessment.png)

---

## 🎤 AI Interview

![AI Interview](docs/screenshots/07-ai-interview.png)

---

## 📊 Interview Result

![Interview Result](docs/screenshots/08-interview-result.png)

---

## 🏢 Recruiter Dashboard

![Recruiter Dashboard](docs/screenshots/09-recruiter-dashboard.png)

---

## 👥 Recruiter Candidates

![Recruiter Candidates](docs/screenshots/10-recruiter-candidates.png)

---

## ⭐ Shortlisted Candidates

![Shortlisted Candidates](docs/screenshots/11-shortlisted.png)

---

## 📊 Candidate Evaluation

![Candidate Evaluation](docs/screenshots/12-candidate-evaluation.png)

---

# 📸 Recommended Screenshots

For a professional GitHub repository, you don't need to upload every single screen.

I recommend keeping these **8 important screenshots**:

```text
01-login.png
02-candidate-dashboard.png
05-ai-job-matching.png
06-assessment.png
07-ai-interview.png
09-recruiter-dashboard.png
10-recruiter-candidates.png
11-shortlisted.png
12-candidate-evaluation.png
```

### Screenshot Guidelines

Use screenshots around:

```text
1440 × 900
```

Keep:

- Consistent browser zoom
- Consistent UI theme
- Realistic demo data
- Clean dashboard state
- No passwords
- No API keys
- No JWT tokens
- No personal/private information

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
