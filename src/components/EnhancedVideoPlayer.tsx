import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import VideoConsentPopup from './VideoConsentPopup';
import { useToast } from '@/hooks/use-toast';

interface Video {
  id: string;
  title: string;
  video_url?: string;
  video_type?: string;
  video_duration?: number;
  requires_consent?: boolean;
  consent_text?: string;
  thumbnail_url?: string;
}

interface EnhancedVideoPlayerProps {
  video: Video;
  autoplay?: boolean;
}

export default function EnhancedVideoPlayer({ video, autoplay = false }: EnhancedVideoPlayerProps) {
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Check for existing consent
  useEffect(() => {
    if (video.requires_consent) {
      const existingConsent = localStorage.getItem(`video_consent_${video.id}`);
      if (existingConsent) {
        const consent = JSON.parse(existingConsent);
        // Check if consent is still valid (24 hours)
        const isValid = Date.now() - consent.timestamp < 24 * 60 * 60 * 1000;
        if (isValid && consent.accepted) {
          setHasConsent(true);
        }
      }
    } else {
      setHasConsent(true);
    }
  }, [video.id, video.requires_consent]);

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('video_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('video_session_id', sessionId);
    }
    return sessionId;
  };

  const trackVideoEvent = async (eventType: string, eventData?: any) => {
    try {
      const sessionId = getSessionId();
      await supabase
        .from('video_analytics')
        .insert({
          post_id: video.id,
          user_session: sessionId,
          event_type: eventType,
          event_data: eventData,
          timestamp_seconds: Math.floor(currentTime)
        });
    } catch (error) {
      console.error('Error tracking video event:', error);
    }
  };

  const handlePlayClick = () => {
    if (video.requires_consent && !hasConsent) {
      setShowConsentPopup(true);
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        trackVideoEvent('pause', { currentTime });
      } else {
        videoRef.current.play();
        trackVideoEvent('play', { currentTime });
      }
    }
  };

  const handleConsentAccept = () => {
    setHasConsent(true);
    setShowConsentPopup(false);
    // Auto-play after consent
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    trackVideoEvent('ended', { duration: currentTime });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
    }
    if (type === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Direct video file
  };

  // Generate structured data for SEO
  const generateVideoStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "thumbnailUrl": video.thumbnail_url || '',
      "uploadDate": new Date().toISOString(),
      "duration": video.video_duration ? `PT${video.video_duration}S` : undefined,
      "embedUrl": video.video_url ? getVideoEmbedUrl(video.video_url, video.video_type || 'youtube') : undefined,
      "contentUrl": video.video_url || '',
      "description": `Watch ${video.title} - Professional video content.`,
      "publisher": {
        "@type": "Organization",
        "name": "Content Hub",
        "url": window.location.origin
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  };

  if (!video.video_url) {
    return (
      <Card className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No video URL provided</p>
        </div>
      </Card>
    );
  }

  // YouTube or Vimeo embed
  if (video.video_type === 'youtube' || video.video_type === 'vimeo') {
    if (!hasConsent && video.requires_consent) {
      return (
        <>
          {generateVideoStructuredData()}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img 
              src={video.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button 
                onClick={handlePlayClick}
                size="lg"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-6"
              >
                <Play className="h-12 w-12" />
              </Button>
            </div>
          </div>
          <VideoConsentPopup
            videoId={video.id}
            consentText={video.consent_text}
            onAccept={handleConsentAccept}
            open={showConsentPopup}
            onOpenChange={setShowConsentPopup}
          />
        </>
      );
    }

    return (
      <>
        {generateVideoStructuredData()}
        <div className="aspect-video rounded-lg overflow-hidden">
          <iframe
            src={getVideoEmbedUrl(video.video_url, video.video_type)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
      </>
    );
  }

  // Direct video file
  return (
    <>
      {generateVideoStructuredData()}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.thumbnail_url}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
        
        {/* Custom Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-primary rounded-full h-1 transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlayClick}
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.requestFullscreen();
                  }
                }}
                className="text-white hover:bg-white/20 p-1"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={handlePlayClick}
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-6"
            >
              <Play className="h-12 w-12" />
            </Button>
          </div>
        )}
      </div>
      
      <VideoConsentPopup
        videoId={video.id}
        consentText={video.consent_text}
        onAccept={handleConsentAccept}
        open={showConsentPopup}
        onOpenChange={setShowConsentPopup}
      />
    </>
  );
}