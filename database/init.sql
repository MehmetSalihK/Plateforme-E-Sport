-- E-Sport Platform Database Initialization
-- PostgreSQL 16+

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Create database if not exists (handled by Docker)
-- This file runs after database creation

-- Set timezone
SET timezone = 'UTC';

-- Create initial schema
CREATE SCHEMA IF NOT EXISTS public;

-- Grant permissions
GRANT ALL ON SCHEMA public TO esport_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO esport_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO esport_app;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database initialized successfully!';
END $$;
