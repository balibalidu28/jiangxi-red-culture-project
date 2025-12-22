CREATE TABLE IF NOT EXISTS red_hero (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS party_encyclopedia (
                                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                                  title VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS red_scenic_spot (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               name VARCHAR(120) NOT NULL,
    description TEXT,
    location VARCHAR(120),
    image_url VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS red_story (
                                         id INT AUTO_INCREMENT PRIMARY KEY,
                                         title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(255),
    created_at DATETIME
    );

CREATE TABLE IF NOT EXISTS red_explore (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           title VARCHAR(150) NOT NULL,
    content TEXT,
    date DATE,
    location VARCHAR(120)
    );
/*
CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL
    );
*/
-- 在 resources/sql 目录下创建 schema.sql
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID，自增',
                                     username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    phone VARCHAR(11) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '用户角色：USER, ADMIN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    INDEX idx_username (username),
    INDEX idx_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
USE red_culture_db;