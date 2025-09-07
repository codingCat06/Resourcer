-- Resourcer Database Schema

CREATE DATABASE IF NOT EXISTS resourcer;
USE resourcer;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    profile_image_url VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    subscription_type ENUM('free', 'pro') DEFAULT 'free',
    subscription_expires_at DATETIME,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    tags JSON,
    apis_modules JSON,
    work_environment JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    click_count INT DEFAULT 0,
    total_earnings DECIMAL(8, 2) DEFAULT 0.00,
    last_earnings_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT(title, content, summary)
);

-- Post clicks tracking
CREATE TABLE post_clicks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_clicked_at (clicked_at)
);

-- Search queries for analytics
CREATE TABLE search_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    query_text VARCHAR(500) NOT NULL,
    work_environment JSON,
    results_count INT DEFAULT 0,
    clicked_post_id INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (clicked_post_id) REFERENCES posts(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_searched_at (searched_at)
);

-- API usage tracking (for pro plan)
CREATE TABLE api_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    request_count INT DEFAULT 1,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_endpoint_date (user_id, endpoint, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date)
);

-- Earnings tracking
CREATE TABLE earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    amount DECIMAL(8, 4) NOT NULL,
    clicks_count INT NOT NULL,
    earnings_date DATE NOT NULL,
    ad_revenue DECIMAL(8, 4) NOT NULL,
    platform_fee DECIMAL(8, 4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_earnings_date (earnings_date)
);

-- Admin settings
CREATE TABLE admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('min_clicks_for_earnings', '100', 'Minimum clicks required before earnings are calculated'),
('earnings_percentage', '70', 'Percentage of ad revenue given to content creators'),
('pro_api_limit_monthly', '10000', 'Monthly API call limit for pro subscribers');

-- Create indexes for better search performance
CREATE INDEX idx_posts_tags ON posts((CAST(tags AS CHAR(255))));
CREATE INDEX idx_posts_apis_modules ON posts((CAST(apis_modules AS CHAR(255))));