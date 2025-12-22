CREATE TABLE IF NOT EXISTS red_hero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS party_encyclopedia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image_url VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS red_scenic_spot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
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

# CREATE TABLE IF NOT EXISTS users (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     username VARCHAR(60) NOT NULL UNIQUE,
#     password VARCHAR(120) NOT NULL,
#     role VARCHAR(20) NOT NULL
#     );