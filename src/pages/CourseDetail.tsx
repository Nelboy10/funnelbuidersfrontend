// ============================================================
// Funnel Builders — Course Detail Page
// Light theme with SVG icons & refined copywriting
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as courseApi from '../api/courses';
import { useAuth } from '../context/AuthContext';
import type { Course, Module } from '../types';
import { formatPrice, formatDuration, getLevelLabel } from '../utils/formatters';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

// Module Accordion Item Component
function ModuleAccordionItem({ module, isOpen, onClick }: { module: Module; isOpen: boolean; onClick: () => void }) {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className={`module-accordion__item ${isOpen ? 'module-accordion__item--open' : ''}`}>
      <button className="module-accordion__header" onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>Module {module.order + 1}</span>
          <span>{module.title}</span>
        </div>
        <svg className="module-accordion__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      
      {isOpen && (
        <div className="module-accordion__body">
          {module.videos.length > 0 ? (
            module.videos.map((video) => {
              const isLocked = video.video_file === null && video.youtube_url === null;
              
              return (
                <div
                  key={video.id}
                  className="module-accordion__video"
                  onClick={() => !isLocked && navigate(`/courses/${slug}/watch?video=${video.id}`)}
                  style={{ cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.7 : 1 }}
                >
                  <div className={`module-accordion__video-icon ${isLocked ? 'module-accordion__video-icon--lock' : 'module-accordion__video-icon--play'}`}>
                    {isLocked ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    )}
                  </div>
                  
                  <div className="module-accordion__video-info">
                    <div className="module-accordion__video-title">{video.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      {video.duration && (
                        <div className="module-accordion__video-duration">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                      {video.free_preview && (
                        <Badge variant="free">Aperçu gratuit</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '16px 24px', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
              Aucune vidéo dans ce module.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Keep track of which modules are open
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      try {
        const data = await courseApi.getCourse(slug);
        setCourse(data);
        
        // Open the first module by default
        if (data.modules && data.modules.length > 0) {
          setOpenModules({ [data.modules[0].id]: true });
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Formation introuvable.');
        } else {
          setError('Impossible de charger cette formation.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const toggleModule = (moduleId: number) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (isLoading) return <Loader fullPage />;
  
  if (error || !course) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state__icon" style={{ margin: '0 auto var(--space-5)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h1 style={{ marginBottom: '16px' }}>{error}</h1>
        <Link to="/courses"><Button>Retour au catalogue</Button></Link>
      </div>
    );
  }

  // Determine if user has purchased the course. 
  // Backend returns modules=[] if NOT purchased (unless ADMIN or free course).
  const isPurchased = course.modules && course.modules.length > 0;
  
  // Calculate total videos count
  const totalVideos = course.modules?.reduce((acc, mod) => acc + mod.videos.length, 0) || 0;

  return (
    <div className="container" style={{ paddingBottom: 'var(--space-16)' }}>
      {/* Hero Section */}
      <div className="course-hero">
        <div style={{ order: 2 }}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="course-hero__thumbnail" />
          ) : (
            <div className="course-hero__thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line><line x1="17" y1="17" x2="22" y2="17"></line></svg>
            </div>
          )}
        </div>
        
        <div style={{ order: 1 }}>
          <div className="course-hero__meta">
            <Badge variant={course.level.toLowerCase() as any}>{getLevelLabel(course.level)}</Badge>
            {course.total_duration && (
              <Badge variant="info">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {formatDuration(course.total_duration)}
              </Badge>
            )}
          </div>
          
          <h1 className="course-hero__title">{course.title}</h1>
          <p className="course-hero__description">{course.description}</p>
          
          <div className={course.price === '0.00' ? 'course-hero__price--free course-hero__price' : 'course-hero__price'}>
            {formatPrice(course.price)}
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            {isPurchased ? (
              <Link to={`/courses/${slug}/watch`}>
                <Button size="lg" variant="primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Continuer la formation
                </Button>
              </Link>
            ) : (
              <Button size="lg" variant="primary" onClick={() => alert("L'intégration du paiement (Stripe/Paypal) est en cours de développement.")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                {course.price === '0.00' ? "S'inscrire gratuitement" : "Accéder à la formation"}
              </Button>
            )}
            
            {!isAuthenticated && !isPurchased && (
              <Link to="/login" state={{ from: `/courses/${slug}` }}>
                <Button size="lg" variant="secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-8) 0' }} />

      {/* Course Content / Modules */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Programme de la formation
          </h2>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {course.modules?.length || 0} modules • {totalVideos} vidéos
          </div>
        </div>
        
        {course.modules && course.modules.length > 0 ? (
          <div className="module-accordion">
            {course.modules.map(module => (
              <ModuleAccordionItem 
                key={module.id} 
                module={module} 
                isOpen={!!openModules[module.id]} 
                onClick={() => toggleModule(module.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12) var(--space-6)' }}>
            <div className="empty-state__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="empty-state__title">Contenu réservé aux membres</h3>
            <p className="empty-state__description" style={{ marginBottom: 0 }}>
              Accédez à l'intégralité du programme en vous inscrivant à cette formation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
