-- ============================================
-- PUC HUB DATABASE SETUP
-- Run this in phpMyAdmin or MySQL command line
-- ============================================
//<!-- Made by: Team PUC HUB | Internet Programming Lab Project -->
 //<!--Rahul-->


CREATE DATABASE IF NOT EXISTS puc_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE puc_hub;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT '',
    semester VARCHAR(20) DEFAULT '',
    section VARCHAR(10) DEFAULT '',
    blood_group VARCHAR(5) DEFAULT '',
    advisor VARCHAR(100) DEFAULT '',
    profile_image TEXT DEFAULT '',
    profile_completed TINYINT(1) DEFAULT 0,
    is_admin TINYINT(1) DEFAULT 0,
    is_blocked TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- LOGIN LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20),
    username VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('success', 'failed') DEFAULT 'success',
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20),
    username VARCHAR(100),
    page_visited VARCHAR(100),
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DEFAULT ADMIN USER
-- Password: admin123 (change after first login!)
-- ============================================
INSERT INTO users (username, student_id, password_hash, is_admin, profile_completed)
VALUES ('Admin', '000000000000000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1)
ON DUPLICATE KEY UPDATE username = username;

-- Note: password hash above = 'password' (bcrypt)
-- Change it immediately after setup!