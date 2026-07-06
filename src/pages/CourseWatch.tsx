// ============================================================
// Funnel Builders — Course Watch Page
// Light theme with SVG icons
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as courseApi from '../api/courses';
import * as progressApi from '../api/progress';
import type { Course, Video, UserProgress } from '../types';
import VideoPlayer from '../components/course/VideoPlayer';
import Loader from '../components/ui/Loader';
import { formatDuration } from '../utils/formatters';

export default function CourseWatch() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get('video');

  const [course, setCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Load course data
  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      try {
        const data = await courseApi.getCourse(slug);
        setCourse(data);
        
        // Ensure user actually has access to modules
        if (!data.modules || data.modules.length === 0) {
          setError("Vous n'avez pas accès à cette formation.");
          setIsLoading(false);
          return;
        }

        // Try loading progress
        try {
          const prog = await progressApi.getProgress(data.id);
          setProgress(prog);
        } catch (e) {
          // Progress might not exist yet, that's fine
          console.log("No progress found for course", data.id);
        }
      } catch (err) {
        setError('Impossible de charger la formation.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  // 2. Set active video based on URL param OR progress OR first video
  useEffect(() => {
    if (!course || !course.modules || course.modules.length === 0) return;

    const allVideos = course.modules.flatMap(m => m.videos);
    if (allVideos.length === 0) return;

    let videoToPlay: Video | undefined;

    if (videoIdParam) {
      // Find video from URL param
      const id = parseInt(videoIdParam, 10);
      videoToPlay = allVideos.find(v => v.id === id);
    } else if (progress?.last_watched_video) {
      // Find last watched video
      videoToPlay = allVideos.find(v => v.id === progress.last_watched_video);
    }

    // Default to very first video if none found
    if (!videoToPlay) {
      videoToPlay = allVideos[0];
      setSearchParams({ video: String(videoToPlay.id) }, { replace: true });
    } else {
      setActiveVideo(videoToPlay);
    }
  }, [course, videoIdParam, progress, setSearchParams]);

  // 3. Handle saving progress
  const handleProgress = useCallback(async (seconds: number, percentage: string) => {
    if (!course || !activeVideo) return;
    
    try {
      await progressApi.updateProgress({
        course: course.id,
        last_watched_video: activeVideo.id,
        position_in_seconds: seconds,
        progress_percentage: percentage
      });
      
      // Opt: update local progress state silently
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  }, [course, activeVideo]);

  // 4. Handle video end (auto-advance)
  const handleVideoEnded = () => {
    if (!course || !activeVideo) return;
    
    // Save 100% progress
    handleProgress(0, "100.00");

    // Find next video
    const allVideos = course.modules.flatMap(m => m.videos);
    const currentIndex = allVideos.findIndex(v => v.id === activeVideo.id);
    
    if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      
      // Only auto-advance if the next video is accessible (not locked)
      if (nextVideo.video_file || nextVideo.youtube_url) {
        setSearchParams({ video: String(nextVideo.id) });
      }
    }
  };

  if (isLoading) return <Loader fullPage />;
  if (error || !course) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state__icon" style={{ margin: '0 auto var(--space-5)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h1 style={{ marginBottom: '16px' }}>{error}</h1>
        <button className="btn btn--primary" onClick={() => navigate('/courses')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Retour au catalogue
        </button>
      </div>
    );
  }

  const allVideos = course.modules.flatMap(m => m.videos);
  
  // Calculate total course progress
  const overallProgress = progress ? parseFloat(progress.progress_percentage) : 0;

  return (
    <div className="watch-layout">
      {/* Main Player Area */}
      <div className="watch-player">
        {activeVideo ? (
          <VideoPlayer 
            key={activeVideo.id} // Force remount on video change
            video={activeVideo}
            initialPosition={progress?.last_watched_video === activeVideo.id ? progress.position_in_seconds : 0}
            onProgress={handleProgress}
            onEnded={handleVideoEnded}
          />
        ) : (
          <div className="watch-player__video" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        )}

        {/* Video Info */}
        <div className="watch-player__info">
          {activeVideo && (
            <>
              <h1 className="watch-player__title">{activeVideo.title}</h1>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>
                {activeVideo.duration && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {formatDuration(activeVideo.duration)}
                  </span>
                )}
                {activeVideo.free_preview && (
                  <span style={{ color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Aperçu gratuit
                  </span>
                )}
              </div>
              <p className="watch-player__description">
                {activeVideo.description || 'Aucune description disponible pour cette vidéo.'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="watch-sidebar">
        <div className="watch-sidebar__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            {course.title}
          </div>
        </div>
        
        <div className="watch-sidebar__progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            <span>Progression globale</span>
            <span style={{ fontWeight: 600, color: 'var(--color-accent-primary)' }}>{Math.round(overallProgress)}%</span>
          </div>
          <div className="watch-sidebar__progress-bar">
            <div className="watch-sidebar__progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div>
          {course.modules.map((module, mIdx) => (
            <div key={module.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ 
                padding: '12px 20px', 
                background: 'var(--color-bg-primary)', 
                fontSize: 'var(--font-size-sm)', 
                fontWeight: 600, 
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Module {mIdx + 1}: {module.title}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {module.videos.map((video) => {
                  const isActive = activeVideo?.id === video.id;
                  const isLocked = !video.video_file && !video.youtube_url;
                  
                  return (
                    <button
                      key={video.id}
                      onClick={() => !isLocked && setSearchParams({ video: String(video.id) })}
                      style={{
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: isActive ? 'var(--color-accent-lighter)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--color-accent-primary)' : '3px solid transparent',
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        opacity: isLocked ? 0.6 : 1,
                        transition: 'background 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: isActive ? 'var(--gradient-primary)' : isLocked ? 'var(--color-bg-tertiary)' : 'var(--color-bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'white' : 'var(--color-text-muted)',
                        flexShrink: 0,
                        boxShadow: isActive ? '0 2px 6px rgba(59, 130, 246, 0.3)' : 'none'
                      }}>
                        {isLocked ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        ) : isActive ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                        )}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontSize: 'var(--font-size-sm)', 
                          color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-primary)',
                          fontWeight: isActive ? 600 : 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {video.title}
                        </div>
                        {video.duration && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                            {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
