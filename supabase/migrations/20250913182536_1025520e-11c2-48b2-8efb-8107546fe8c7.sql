-- Add video ad positions to the ad_position enum if they don't exist
DO $$ 
BEGIN 
    -- Check if enum exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ad_position') THEN
        CREATE TYPE ad_position AS ENUM (
            'homepage_top',
            'homepage_middle', 
            'homepage_bottom',
            'post_before',
            'post_inside',
            'post_after',
            'video_banner_300x250',
            'video_banner_728x90',
            'video_popunder',
            'video_smartlink',
            'video_social_bar',
            'video_native_banner'
        );
    ELSE
        -- Add new values to existing enum
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_banner_300x250';
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_banner_728x90';
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_popunder';
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_smartlink';
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_social_bar';
        ALTER TYPE ad_position ADD VALUE IF NOT EXISTS 'video_native_banner';
    END IF;
END $$;