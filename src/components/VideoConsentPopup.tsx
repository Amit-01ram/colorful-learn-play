import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Play, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoConsentPopupProps {
  videoId: string;
  consentText?: string;
  onAccept: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VideoConsentPopup({ 
  videoId, 
  consentText, 
  onAccept, 
  open, 
  onOpenChange 
}: VideoConsentPopupProps) {
  const [consentTypes, setConsentTypes] = useState({
    functional: true,
    analytics: false,
    marketing: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate session ID for tracking
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('video_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('video_session_id', sessionId);
    }
    return sessionId;
  };

  const handleAccept = async () => {
    setIsLoading(true);
    
    try {
      const sessionId = getSessionId();
      const consentArray = Object.entries(consentTypes)
        .filter(([, accepted]) => accepted)
        .map(([type]) => type);

      // Log consent
      const { error } = await supabase
        .from('video_consent_logs')
        .insert({
          post_id: videoId,
          user_session: sessionId,
          consent_given: true,
          consent_type: consentArray,
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // Store consent in localStorage for future visits
      localStorage.setItem(`video_consent_${videoId}`, JSON.stringify({
        accepted: true,
        timestamp: Date.now(),
        types: consentArray
      }));

      toast({
        title: 'Consent Recorded',
        description: 'You can now watch the video.',
      });

      onAccept();
    } catch (error) {
      console.error('Error recording consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to record consent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    toast({
      title: 'Consent Declined',
      description: 'You need to accept the terms to watch this video.',
      variant: 'destructive',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Video Consent Required
          </DialogTitle>
          <DialogDescription className="text-left">
            {consentText || 'This video uses cookies and tracking technologies. Please review and accept the terms below to continue.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="functional" 
                checked={consentTypes.functional}
                onCheckedChange={(checked) => 
                  setConsentTypes(prev => ({ ...prev, functional: checked as boolean }))
                }
                disabled
              />
              <label htmlFor="functional" className="text-sm">
                <strong>Essential</strong> - Required for video playback
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analytics" 
                checked={consentTypes.analytics}
                onCheckedChange={(checked) => 
                  setConsentTypes(prev => ({ ...prev, analytics: checked as boolean }))
                }
              />
              <label htmlFor="analytics" className="text-sm">
                <strong>Analytics</strong> - Help us improve video content
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={consentTypes.marketing}
                onCheckedChange={(checked) => 
                  setConsentTypes(prev => ({ ...prev, marketing: checked as boolean }))
                }
              />
              <label htmlFor="marketing" className="text-sm">
                <strong>Marketing</strong> - Personalized recommendations
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleAccept}
              disabled={isLoading || !consentTypes.functional}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Accept & Watch'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDecline}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Your consent is stored locally and can be withdrawn at any time in your browser settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}