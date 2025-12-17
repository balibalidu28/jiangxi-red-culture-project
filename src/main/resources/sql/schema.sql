-- 景点信息表
use red_culture
CREATE TABLE scenic_spot (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL COMMENT '景点名称',
                             description TEXT COMMENT '景点描述',
                             image_url VARCHAR(255) COMMENT '图片URL',
                             location VARCHAR(255) COMMENT '地址',
                             category VARCHAR(50) COMMENT '分类'
);

-- 用户信息表
CREATE TABLE user (
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
                      password VARCHAR(255) NOT NULL COMMENT '密码',
                      email VARCHAR(255) COMMENT '邮箱'
);

-- 评论表
CREATE TABLE comment (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         scenic_spot_id INT NOT NULL,
                         user_name VARCHAR(50) NOT NULL,
                         content TEXT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (scenic_spot_id) REFERENCES scenic_spot(id)
);