-- TechReview Blog Database Schema

CREATE DATABASE IF NOT EXISTS techreview_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE techreview_blog;

-- Users table
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    bio TEXT,
    role VARCHAR(20) DEFAULT 'USER',
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3b82f6',
    parent_id BIGINT,
    sort_order INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE IF NOT EXISTS tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Articles table
CREATE TABLE IF NOT EXISTS article (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    summary TEXT,
    content LONGTEXT,
    cover_image VARCHAR(255),
    category_id BIGINT,
    author_id BIGINT,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    rating DECIMAL(3,1),
    status INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_published (published_at),
    FULLTEXT INDEX idx_content (title, summary, content),
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES sys_user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article-Tag relationship table
CREATE TABLE IF NOT EXISTS article_tag (
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    category_id BIGINT,
    price DECIMAL(10,2),
    rating DECIMAL(3,1),
    review_count INT DEFAULT 0,
    purchase_link VARCHAR(500),
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_category (category_id),
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments table
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    parent_id BIGINT,
    user_id BIGINT,
    content TEXT NOT NULL,
    author_name VARCHAR(50),
    author_email VARCHAR(100),
    like_count INT DEFAULT 0,
    status INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0,
    INDEX idx_article (article_id),
    INDEX idx_parent (parent_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comment(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES sys_user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- Password is BCrypt encoded
INSERT INTO sys_user (username, password, email, nickname, role, status) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 'admin@techreview.com', 'Administrator', 'ADMIN', 1);

-- Insert default editor user (password: editor123)
INSERT INTO sys_user (username, password, email, nickname, role, status) 
VALUES ('editor', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', 'editor@techreview.com', 'Editor', 'EDITOR', 1);

-- Insert default categories
INSERT INTO category (name, slug, description, color, sort_order) VALUES
('Smartphones', 'smartphones', 'Latest smartphone reviews and comparisons', '#3b82f6', 1),
('Laptops', 'laptops', 'Professional laptop reviews for work and gaming', '#8b5cf6', 2),
('Smart Home', 'smart-home', 'Smart home devices and automation', '#f97316', 3),
('Accessories', 'accessories', 'Tech accessories and peripherals', '#22c55e', 4),
('Audio', 'audio', 'Headphones, speakers and audio equipment', '#ec4899', 5),
('Cameras', 'cameras', 'Digital cameras and photography gear', '#14b8a6', 6);

-- Insert sample article
INSERT INTO article (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, view_count, like_count, rating) 
VALUES (
    'iPhone 16 Pro Max Review: Is It Worth the Upgrade?',
    'iphone-16-pro-max-review',
    'After two weeks of intensive use, we comprehensively analyze this flagship phone performance in camera, battery life, and more...',
    '<h2>Introduction</h2><p>The iPhone 16 Pro Max represents Apple latest flagship offering...</p><h2>Design and Build Quality</h2><p>The device features a premium titanium construction...</p><h2>Camera Performance</h2><p>The new 48MP main sensor delivers exceptional results...</p><h2>Battery Life</h2><p>With a 4,685 mAh battery, the device easily lasts a full day...</p><h2>Conclusion</h2><p>The iPhone 16 Pro Max is a worthy upgrade for those coming from older models...</p>',
    1, 1, 1, TRUE, NOW(), 12500, 856, 4.5
);