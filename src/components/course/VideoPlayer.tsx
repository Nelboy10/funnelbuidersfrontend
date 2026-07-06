// ============================================================
// Funnel Builders — Video Player Component
// Supports both native video files and YouTube embeds
// ============================================================

import { useRef, useEffect, useState } from 'react';
import type { Video } from '../../types';

export interface VideoPlayerProps {
  video: Video;
  onEnded?: () => void;
  onProgress?: (progressSeconds: number, progressPercentage: string) => void;
  initialPosition?: number;
}

/**
 * Extract YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
}

function YouTubePlayer({ video }: { video: Video }) {
  const videoId = extractYouTubeId(video.youtube_url || '');
  
  if (!videoId) {
    return (
      <div className="watch-player__video" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style={{ marginTop: '12px', fontSize: '14px', opacity: 0.8 }}>Lien YouTube invalide</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={video.title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function NativeVideoPlayer({ video, onEnded, onProgress, initialPosition = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync initial position
  useEffect(() => {
    if (videoRef.current && initialPosition > 0) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition, video.id]); // re-run if video changes

  // Track progress every few seconds
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let intervalId: number;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // Save progress periodically when playing (e.g., every 10 seconds)
    if (isPlaying && onProgress) {
      intervalId = window.setInterval(() => {
        const currentTime = videoEl.currentTime;
        const duration = videoEl.duration;
        
        if (duration > 0) {
          const percentage = ((currentTime / duration) * 100).toFixed(2);
          onProgress(Math.floor(currentTime), percentage);
          setProgress((currentTime / duration) * 100);
        }
      }, 10000); // 10s
    }

    // Time update for progress bar (internal UI only, not API)
    const handleTimeUpdate = () => {
      if (videoEl.duration) {
        setProgress((videoEl.currentTime / videoEl.duration) * 100);
      }
    };

    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    
    if (onEnded) {
      videoEl.addEventListener('ended', onEnded);
    }

    return () => {
      window.clearInterval(intervalId);
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      if (onEnded) {
        videoEl.removeEventListener('ended', onEnded);
      }
    };
  }, [isPlaying, onProgress, onEnded]);

  // Handle saving progress exactly when unmounting or changing video
  useEffect(() => {
    return () => {
      if (videoRef.current && onProgress) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        if (duration > 0) {
          const percentage = ((currentTime / duration) * 100).toFixed(2);
          onProgress(Math.floor(currentTime), percentage);
        }
      }
    };
  }, [video.id, onProgress]);

  return (
    <div style={{ width: '100%', position: 'relative', background: '#000' }}>
      <video
        ref={videoRef}
        src={video.video_file!}
        poster={video.thumbnail || undefined}
        controls
        controlsList="nodownload"
        className="watch-player__video"
        playsInline
      />
      {/* Custom thin progress bar at bottom of video player area */}
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.2)', width: '100%', position: 'absolute', bottom: 0, left: 0, zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-accent-primary)', transition: 'width 0.1s linear' }} />
      </div>
    </div>
  );
}

export default function VideoPlayer({ video, onEnded, onProgress, initialPosition = 0 }: VideoPlayerProps) {
  // No video source available at all
  if (!video.video_file && !video.youtube_url) {
    return (
      <div className="watch-player__video" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="video-lock-overlay" style={{ position: 'relative' }}>
          <div className="video-lock-overlay__icon">🔒</div>
          <h3 style={{ color: 'white' }}>Vidéo protégée</h3>
          <p>Vous n'avez pas accès à cette vidéo.</p>
        </div>
      </div>
    );
  }

  // YouTube video
  if (video.youtube_url) {
    return <YouTubePlayer video={video} />;
  }

  // Native video file
  return (
    <NativeVideoPlayer
      video={video}
      onEnded={onEnded}
      onProgress={onProgress}
      initialPosition={initialPosition}
    />
  );
}
