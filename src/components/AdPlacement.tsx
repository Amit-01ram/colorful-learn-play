import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Ad {
  id: string;
  name: string;
  code: string;
  position: string;
  is_active: boolean;
}

interface AdPlacementProps {
  position: 'homepage_top' | 'homepage_middle' | 'homepage_bottom' | 'post_before' | 'post_inside' | 'post_after' | 
           'video_banner_300x250' | 'video_banner_728x90' | 'video_popunder' | 'video_smartlink' | 'video_social_bar' | 'video_native_banner';
  postId?: string;
  className?: string;
}

// Declare gtag function for TypeScript
declare global {
  function gtag(...args: any[]): void;
}

export default function AdPlacement({ position, postId, className = '' }: AdPlacementProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [position, postId]);

  const fetchAd = async () => {
    try {
      let query = supabase
        .from('ads')
        .select('*')
        .eq('position', position as any)
        .eq('is_active', true);

      // If postId is provided, check for specific ad placements first
      if (postId) {
        const { data: placementData } = await supabase
          .from('ad_placements')
          .select(`
            ad_id,
            ads:ad_id (
              id,
              name,
              code,
              position,
              is_active
            )
          `)
          .eq('post_id', postId)
          .eq('position', position as any)
          .eq('is_active', true)
          .single();

        if (placementData?.ads) {
          setAd(placementData.ads as Ad);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to global ads for this position
      const { data, error } = await query.limit(1).single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error fetching ad:', error);
      } else if (data) {
        setAd(data);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`bg-muted rounded-lg ${getAdDimensions(position)}`} />
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <div 
      className={`ad-placement ad-${position} ${className}`}
      data-ad-id={ad.id}
      data-ad-position={position}
    >
      {/* Ad Label for Transparency */}
      <div className="text-xs text-muted-foreground mb-2 text-center">
        Advertisement
      </div>
      
      {/* Ad Content */}
      <div 
        className="ad-content"
        dangerouslySetInnerHTML={{ __html: ad.code }}
      />
      
      {/* Invisible tracking pixel for analytics */}
      <img
        src={`data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`}
        alt=""
        style={{ display: 'none' }}
        onLoad={() => {
          // Track ad impression
          try {
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'ad_impression', {
                ad_id: ad.id,
                ad_position: position,
                post_id: postId || 'global'
              });
            }
          } catch (error) {
            // Silently fail if gtag is not available
            console.debug('Analytics tracking not available');
          }
        }}
      />
    </div>
  );
}

function getAdDimensions(position: string): string {
  switch (position) {
    case 'homepage_top':
    case 'homepage_bottom':
    case 'post_before':
    case 'post_after':
      return 'h-24 w-full'; // Banner style
    case 'post_inside':
      return 'h-32 w-full'; // Inline content style
    case 'homepage_middle':
      return 'h-64 w-full'; // Large banner style
    case 'video_banner_300x250':
      return 'h-[250px] w-[300px]'; // Medium Rectangle Banner
    case 'video_banner_728x90':
      return 'h-[90px] w-full max-w-[728px]'; // Leaderboard Banner
    case 'video_popunder':
      return 'h-0 w-0 overflow-hidden'; // Hidden popunder trigger
    case 'video_smartlink':
      return 'h-8 w-full'; // Smartlink style
    case 'video_social_bar':
      return 'h-12 w-full'; // Social bar style
    case 'video_native_banner':
      return 'h-40 w-full'; // Native ad style
    default:
      return 'h-24 w-full';
  }
}