--  psql caper-petition -f users.sql

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK(first != ''),
    last VARCHAR NOT NULL CHECK(last != ''),
    email TEXT NOT NULL CHECK(email != '') UNIQUE,
    hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);