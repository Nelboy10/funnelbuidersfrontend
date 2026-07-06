// ============================================================
// Funnel Builders — Video Form
// Supports YouTube URL or file upload via toggle
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import * as courseApi from '../../api/courses';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

type VideoSourceType = 'youtube' | 'file';

/**
 * Extract YouTube video ID for preview embed
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

export default function VideoForm() {
  const { slug, moduleId, videoId } = useParams<{ slug: string; moduleId: string; videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!videoId;
  const currentModuleId = moduleId ? parseInt(moduleId, 10) : null;
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor' : '/admin';

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  const [videoSourceType, setVideoSourceType] = useState<VideoSourceType>('youtube');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    order: 0,
    free_preview: false,
    youtube_url: '',
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isEditing || !videoId) return;
      try {
        const vid = await courseApi.getVideo(parseInt(videoId, 10));
        setFormData({
          title: vid.title,
          description: vid.description || '',
          duration: vid.duration || '',
          order: vid.order,
          free_preview: vid.free_preview,
          youtube_url: vid.youtube_url || '',
        });
        // Determine the source type from existing data
        if (vid.youtube_url) {
          setVideoSourceType('youtube');
        } else {
          setVideoSourceType('file');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [videoId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        order: formData.order,
        free_preview: formData.free_preview,
        module: currentModuleId!,
      };

      if (videoSourceType === 'youtube') {
        payload.youtube_url = formData.youtube_url;
        // Clear video_file if switching to YouTube
      } else {
        if (videoFile) {
          payload.video_file = videoFile;
        }
        // Clear youtube_url if switching to file
        payload.youtube_url = '';
      }

      if (thumbnailFile) {
        payload.thumbnail = thumbnailFile;
      }

      if (isEditing && videoId) {
        await courseApi.updateVideo(parseInt(videoId, 10), payload);
      } else {
        if (videoSourceType === 'file' && !videoFile) {
          throw new Error("Le fichier vidéo est requis");
        }
        if (videoSourceType === 'youtube' && !formData.youtube_url) {
          throw new Error("Le lien YouTube est requis");
        }
        await courseApi.createVideo(payload);
      }
      navigate(`${basePath}/courses/${slug}/modules`);
    } catch (err) {
      alert("Erreur lors de la sauvegarde. Assurez-vous d'avoir rempli tous les champs.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  const youtubePreviewId = extractYouTubeId(formData.youtube_url);

  return (
    <>
      <div className="admin-content__header">
        <h1 className="admin-content__title">{isEditing ? 'Modifier la vidéo' : 'Nouvelle vidéo'}</h1>
        <Link to={`${basePath}/courses/${slug}/modules`}><Button variant="secondary">Retour</Button></Link>
      </div>

      <Card style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input name="title" label="Titre de la vidéo *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <Input type="number" name="order" label="Ordre d'affichage" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value, 10)})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input name="duration" label="Durée (HH:MM:SS)" placeholder="Ex: 00:15:30" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            
            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.free_preview} onChange={e => setFormData({...formData, free_preview: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <span>Aperçu gratuit (accessible sans achat)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          {/* ── Video Source Toggle ───────────────────────────────── */}
          <div style={{ background: 'var(--color-bg-secondary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Source de la vidéo</label>
            
            <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setVideoSourceType('youtube')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: videoSourceType === 'youtube' ? 'var(--gradient-primary)' : 'var(--color-bg-primary)',
                  color: videoSourceType === 'youtube' ? 'white' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceType('file')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  borderLeft: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: videoSourceType === 'file' ? 'var(--gradient-primary)' : 'var(--color-bg-primary)',
                  color: videoSourceType === 'file' ? 'white' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Fichier vidéo
              </button>
            </div>

            {videoSourceType === 'youtube' ? (
              <div>
                <Input
                  name="youtube_url"
                  label="Lien YouTube *"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtube_url}
                  onChange={e => setFormData({...formData, youtube_url: e.target.value})}
                  helpText="Collez le lien YouTube de votre vidéo de formation"
                />

                {/* YouTube Preview */}
                {youtubePreviewId && (
                  <div style={{ marginTop: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubePreviewId}?rel=0&modestbranding=1`}
                        title="Aperçu YouTube"
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
                    <div style={{ 
                      padding: '8px 12px', 
                      background: 'var(--color-bg-primary)', 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Aperçu de la vidéo YouTube
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Fichier Vidéo (MP4) {isEditing ? "(Laisser vide pour conserver l'actuel)" : '*'}</label>
                  <input type="file" accept="video/mp4,video/webm" className="form-input" onChange={e => setVideoFile(e.target.files?.[0] || null)} required={!isEditing && videoSourceType === 'file'} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Miniature (Optionnel)</label>
                  <input type="file" accept="image/*" className="form-input" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} />
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail for YouTube mode */}
          {videoSourceType === 'youtube' && (
            <div className="form-group">
              <label className="form-label">Miniature personnalisée (Optionnel — YouTube utilise sa propre miniature par défaut)</label>
              <input type="file" accept="image/*" className="form-input" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} />
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" isLoading={isSaving}>{isEditing ? 'Mettre à jour' : 'Enregistrer la vidéo'}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
