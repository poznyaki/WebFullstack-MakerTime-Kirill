-- Схема бази даних для MySQL.
-- Базу даних створює скрипт create-db.js (CREATE DATABASE + USE),
-- тому тут описуємо лише таблиці та індекси.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    mp3_path TEXT NOT NULL,
    cover_path TEXT,
    genre VARCHAR(100),
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_tracks_author (author),
    INDEX idx_tracks_genre (genre)
);
