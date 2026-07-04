-- Medical Report Summarizer Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS medical_report_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medical_report_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical reports table
CREATE TABLE IF NOT EXISTS medical_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    doctor_name VARCHAR(150),
    hospital_name VARCHAR(200),
    report_date DATE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    report_text LONGTEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reports_patient (patient_name),
    INDEX idx_reports_date (report_date),
    INDEX idx_reports_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical summaries table
CREATE TABLE IF NOT EXISTS medical_summaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE,
    summary TEXT,
    medical_conditions TEXT,
    medications TEXT,
    lab_results TEXT,
    doctor_recommendations TEXT,
    risk_factors TEXT,
    follow_up TEXT,
    important_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_summaries_report FOREIGN KEY (report_id) REFERENCES medical_reports(id) ON DELETE CASCADE,
    INDEX idx_summaries_report (report_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
