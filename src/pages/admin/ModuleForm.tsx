// ============================================================
// Funnel Builders — Module Form
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import * as courseApi from '../../api/courses';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function ModuleForm() {
  const { slug, moduleId } = useParams<{ slug: string; moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!moduleId;
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor' : '/admin';

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        if (!slug) return;
        const course = await courseApi.getCourse(slug);
        setCourseId(course.id);

        if (isEditing && moduleId) {
          const mod = await courseApi.getModule(parseInt(moduleId, 10));
          setFormData({
            title: mod.title,
            description: mod.description || '',
            order: mod.order,
          });
        } else {
          // Default order for new module
          setFormData(prev => ({ ...prev, order: course.modules.length }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, moduleId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    setIsSaving(true);

    try {
      const payload = { ...formData, course: courseId };
      if (isEditing && moduleId) {
        await courseApi.updateModule(parseInt(moduleId, 10), payload);
      } else {
        await courseApi.createModule(payload);
      }
      navigate(`${basePath}/courses/${slug}/modules`);
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      <div className="admin-content__header">
        <h1 className="admin-content__title">{isEditing ? 'Modifier le module' : 'Nouveau module'}</h1>
        <Link to={`${basePath}/courses/${slug}/modules`}><Button variant="secondary">Retour</Button></Link>
      </div>

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Input name="title" label="Titre du module *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <Input type="number" name="order" label="Ordre d'affichage" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value, 10)})} required />
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" isLoading={isSaving}>Sauvegarder</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
