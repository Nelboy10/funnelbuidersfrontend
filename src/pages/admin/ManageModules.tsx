// ============================================================
// Funnel Builders — Manage Modules Page
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import * as courseApi from '../../api/courses';
import type { Course } from '../../types';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

export default function ManageModules() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor' : '/admin';
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const data = await courseApi.getCourse(slug);
      setCourse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Supprimer le module "${title}" ? Toutes ses vidéos seront supprimées.`)) {
      try {
        await courseApi.deleteModule(id);
        loadData();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (isLoading) return <Loader fullPage />;
  if (!course) return <div>Cours introuvable.</div>;

  return (
    <>
      <div className="admin-content__header">
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Formation : {course.title}
          </div>
          <h1 className="admin-content__title">Modules & Vidéos</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={`${basePath}/courses`}><Button variant="secondary">Retour</Button></Link>
          <Link to={`${basePath}/courses/${slug}/modules/new`}><Button variant="primary">+ Nouveau module</Button></Link>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {course.modules.length > 0 ? (
          course.modules.map(module => (
            <div key={module.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>
                  <span style={{ color: 'var(--color-text-tertiary)', marginRight: '8px' }}>#{module.order}</span>
                  {module.title}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`${basePath}/courses/${slug}/modules/${module.id}/videos/new`}><Button variant="ghost" size="sm">+ Ajouter vidéo</Button></Link>
                  <Link to={`${basePath}/courses/${slug}/modules/${module.id}/edit`}><Button variant="secondary" size="sm" icon>✏️</Button></Link>
                  <Button variant="danger" size="sm" icon onClick={() => handleDelete(module.id, module.title)}>🗑️</Button>
                </div>
              </div>
              
              <div style={{ padding: '0' }}>
                {module.videos.length > 0 ? (
                  <table className="admin-table" style={{ borderTop: 'none' }}>
                    <tbody>
                      {module.videos.map(video => (
                        <tr key={video.id}>
                          <td style={{ width: '40px', color: 'var(--color-text-tertiary)' }}>#{video.order}</td>
                          <td style={{ width: '60px' }}>
                            {video.thumbnail ? (
                              <img src={video.thumbnail} style={{ width: '60px', height: '34px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                            ) : (
                              <div style={{ width: '60px', height: '34px', background: 'var(--color-bg-tertiary)', borderRadius: '4px' }} />
                            )}
                          </td>
                          <td style={{ fontWeight: 500 }}>{video.title}</td>
                          <td style={{ color: 'var(--color-text-tertiary)' }}>{video.duration || '-'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to={`${basePath}/courses/${slug}/videos/${video.id}/edit`}><Button variant="ghost" size="sm">Modifier</Button></Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>Aucune vidéo dans ce module.</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3 className="empty-state__title">Aucun module</h3>
            <p className="empty-state__description">Créez votre premier module pour commencer à ajouter du contenu.</p>
          </div>
        )}
      </div>
    </>
  );
}
