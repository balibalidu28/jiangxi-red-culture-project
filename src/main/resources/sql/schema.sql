-- 1. 红色英雄表
DROP TABLE IF EXISTS red_hero;
CREATE TABLE `red_hero` (
                            `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                            `name` VARCHAR(100) NOT NULL COMMENT '英雄姓名',
                            `description` TEXT COMMENT '英雄描述',
                            `image_url` VARCHAR(255) DEFAULT NULL COMMENT '英雄图片URL',
                            `alias` VARCHAR(100) DEFAULT NULL COMMENT '别名',
                            `title` VARCHAR(100) DEFAULT NULL COMMENT '称号/职务',
                            `category` VARCHAR(50) DEFAULT NULL COMMENT '类别',
                            `content` LONGTEXT COMMENT '详细事迹内容',
                            `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别',
                            `ethnicity` VARCHAR(20) DEFAULT NULL COMMENT '民族',
                            `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
                            `death_date` DATE DEFAULT NULL COMMENT '逝世日期',
                            `birthplace` VARCHAR(100) DEFAULT NULL COMMENT '籍贯',
                            `political_status` VARCHAR(50) DEFAULT NULL COMMENT '政治面貌',
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='红色英雄表';
-- 2. 党史大百科表
DROP TABLE IF EXISTS party_encyclopedia;
CREATE TABLE IF NOT EXISTS party_encyclopedia (
                                                  id INT AUTO_INCREMENT PRIMARY KEY ,
                                                  title VARCHAR(120) NOT NULL UNIQUE,
                                                  content TEXT NOT NULL,
                                                  image_url VARCHAR(255)
);

-- 3. 红色圣地表
DROP TABLE IF EXISTS red_scenic_spot;
CREATE TABLE IF NOT EXISTS red_scenic_spot (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               name VARCHAR(120) NOT NULL UNIQUE,
                                               description TEXT,
                                               location VARCHAR(120),
                                               image_url VARCHAR(255)
);

-- 2. 红色故事表
DROP TABLE IF EXISTS `red_story`;
CREATE TABLE `red_story` (
                             `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                             `title` VARCHAR(200) NOT NULL COMMENT '标题',
                             `content` TEXT NOT NULL COMMENT '内容',
                             `source` VARCHAR(255) DEFAULT NULL COMMENT '来源',
                             `image_url` VARCHAR(500) DEFAULT NULL COMMENT '图片URL',
                             `summary` VARCHAR(500) DEFAULT NULL COMMENT '摘要',
                             `story_time` VARCHAR(50) DEFAULT NULL COMMENT '故事时间',
                             `location` VARCHAR(100) DEFAULT NULL COMMENT '地点',
                             `hero_name` VARCHAR(100) DEFAULT NULL COMMENT '英雄名称',
                             `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='红色故事表';


-- 5. 红色寻访表
DROP TABLE IF EXISTS red_explore ;
CREATE TABLE IF NOT EXISTS red_explore (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           title VARCHAR(150) NOT NULL,
                                           content TEXT,
                                           date DATE,
                                           location VARCHAR(120)
);

DROP TABLE IF EXISTS red_users ;
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
USE red_culture;