-- Add post_type enum and column to posts table
CREATE TYPE post_type AS ENUM ('article', 'video', 'tool');

-- Add post_type column to posts table
ALTER TABLE posts ADD COLUMN post_type post_type DEFAULT 'article';

-- Add some default categories if they don't exist
INSERT INTO categories (name, slug, description) VALUES 
('Technology', 'technology', 'Latest in technology and development'),
('Design', 'design', 'Design principles and best practices'),
('Marketing', 'marketing', 'Digital marketing strategies'),
('Business', 'business', 'Business insights and strategies'),
('Tools', 'tools', 'Useful tools and utilities')
ON CONFLICT (slug) DO NOTHING;