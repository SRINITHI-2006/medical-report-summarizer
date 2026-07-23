https://ai-medical-report-summarizer-frontend.onrender.com
# 🩺 Medical Report Summarizer

## 📖 Overview

**Medical Report Summarizer** is a secure, AI-powered full-stack web application that simplifies lengthy medical reports into concise, structured summaries. Users can upload PDF medical reports, and the system extracts the report text before using **Google Gemini AI** to generate organized medical insights — including conditions, medications, laboratory results, doctor recommendations, follow-up advice, and important notes.

The application is built with a modern **React** frontend, a **Spring Boot** REST API backend, **JWT authentication**, and **MySQL** database support.

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- BCrypt password encryption
- Protected REST APIs

### 📄 Medical Report Management
- Upload medical reports (PDF)
- Automatic PDF text extraction
- Secure report storage
- View, download, and delete uploaded reports

### 🤖 AI-Powered Medical Summary
Google Gemini AI automatically generates:
- Overall Summary
- Medical Conditions
- Medicines Mentioned
- Laboratory Results
- Doctor Recommendations
- Risk Factors
- Follow-up Advice
- Important Notes

### 📊 Dashboard
- Total uploaded reports
- Total generated summaries
- Recent reports overview
- User profile
- Quick navigation

### 📥 Export
- Download AI-generated summaries as PDF

---

## 🏗 System Architecture

```text
                 React Frontend
                       │
                REST API (Axios)
                       │
                       ▼
             Spring Boot REST Backend
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
   MySQL Database              Google Gemini AI
         │                           │
         └──────────► AI Summary ◄───┘
```

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Axios, React Router DOM |
| **Backend** | Java 17, Spring Boot, Spring Security, Spring Data JPA, JWT, Maven |
| **Database** | MySQL |
| **AI** | Google Gemini API |
| **PDF Processing** | Apache PDFBox |

---

## 📂 Project Structure

```text
medical-report-summarizer/
│
├── database/
│   └── schema.sql
│
├── medical-report-summarizer-backend/
│   ├── src/
│   │   └── main/
│   ├── .env.example
│   ├── .gitignore
│   └── pom.xml
│
├── medical-report-summarizer-frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven
- A Google Gemini API key

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SRINITHI-2006/medical-report-summarizer.git
cd medical-report-summarizer
```

### 2️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd medical-report-summarizer-backend
```

Configure your `.env` or `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medical_report_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
JWT_SECRET=YOUR_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

Backend will start at:

```
http://localhost:8080
```

### 3️⃣ Frontend Setup

Navigate to the frontend:

```bash
cd medical-report-summarizer-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable | Description |
|---|---|
| `spring.datasource.url` | MySQL database connection URL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | API key for Google Gemini AI |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend REST API |

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | ❌ |
| `POST` | `/api/reports/upload` | Upload a medical report PDF | ✅ |
| `GET` | `/api/reports` | Get all reports for a user | ✅ |
| `GET` | `/api/reports/{id}` | Get a specific report | ✅ |
| `DELETE` | `/api/reports/{id}` | Delete a report | ✅ |
| `GET` | `/api/reports/{id}/summary` | Get AI-generated summary | ✅ |
| `GET` | `/api/reports/{id}/download` | Download the summary as PDF | ✅ |

> ℹ️ Exact endpoint paths may vary based on your controller implementation — update this table to match your actual API.
