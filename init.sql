-- У PostgreSQL база даних створюється автоматично через змінну POSTGRES_DB в compose,
-- тому команди CREATE DATABASE та USE тут не потрібні.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,           
    author VARCHAR(255) NOT NULL,        
    mp3_path TEXT NOT NULL,               
    cover_path TEXT,                      
    genre VARCHAR(100),                    
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_tracks_author ON tracks(author);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);