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

-- Insert default categories (High-end Editorial Style)
INSERT INTO category (name, slug, description, color, sort_order) VALUES
('美妆', 'beauty', 'Discover the art of cosmetics and skincare.', '#1A1A1A', 1),
('Living', 'living', 'Intelligent design for modern architectural spaces.', '#2A2A2A', 2),
('旅行', 'travel', 'Curated experiences and gear for the global explorer.', '#3A3A3A', 3),
('3C家电', '3c-appliances', 'Cutting-edge electronics and smart home innovations.', '#111111', 4),
('时尚', 'fashion', 'Avant-garde apparel and timeless style statements.', '#0A0A0A', 5);

-- Insert sample article (High-end Editorial Style)
INSERT INTO article (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, view_count, like_count, rating) 
VALUES (
    'Leica Q3 Monochrom: The Art of Pure Light',
    'leica-q3-monochrom-review',
    'Stripping away color forces a profound confrontation with light, shadow, and texture. Our in-depth exploration of Leica''s latest masterpiece.',
    '<h2>The Philosophy of Black and White</h2><p>In an era obsessed with hyper-saturation and computational photography, the Leica Q3 Monochrom stands as a bold statement of reduction. By removing the Bayer filter, the sensor captures pure luminance, resulting in files with extraordinary dynamic range and virtually nonexistent noise, even in the darkest of environments.</p><h2>Design and Craftsmanship</h2><p>Machined from solid brass and wrapped in premium leather, the device feels less like a consumer gadget and more like a precision instrument. The absence of the iconic red dot—replaced by subtle monochrome engravings—speaks to its understated elegance. It demands to be held, its cold metal body a constant reminder of its mechanical heritage.</p><h2>Optical Excellence</h2><p>The Summilux 28mm f/1.7 ASPH lens resolves detail with a biting sharpness that computational algorithms simply cannot synthesize. The micro-contrast is breathtaking, rendering textures—from the rough grain of concrete to the delicate weave of a fabric—with an almost three-dimensional presence.</p><h2>The Verdict</h2><p>The Leica Q3 Monochrom is unapologetically uncompromising. It is not a camera for everyone. It is a tool for those who understand that sometimes, removing information is the only way to reveal the truth.</p>',
    5, 1, 1, TRUE, NOW(), 28400, 1856, 4.9
);