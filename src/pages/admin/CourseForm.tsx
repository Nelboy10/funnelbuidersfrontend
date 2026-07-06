// ============================================================
// Funnel Builders — Course Form (Create/Edit)
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import * as courseApi from '../../api/courses';
import * as categoryApi from '../../api/categories';
import type { CourseLevel, CourseStatus, Category } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function CourseForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!slug;
  const basePath = location.pathname.startsWith('/instructor') ? '/instructor' : '/admin';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '0.00',
    category: '',
    total_duration: '',
    level: 'BEGINNER' as CourseLevel,
    status: 'DRAFT' as CourseStatus,
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await categoryApi.getCategories();
        setCategories(catRes.results);

        if (isEditing && slug) {
          const course = await courseApi.getCourse(slug);
          setFormData({
            title: course.title,
            slug: course.slug,
            description: course.description,
            price: course.price,
            category: course.category ? String(course.category) : '',
            total_duration: course.total_duration || '',
            level: course.level,
            status: course.status,
          });
          if (course.thumbnail) {
            setThumbnailPreview(course.thumbnail);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        category: formData.category ? parseInt(formData.category, 10) : null,
        thumbnail: thumbnailFile,
      };

      if (isEditing && slug) {
        await courseApi.updateCourse(slug, payload);
      } else {
        await courseApi.createCourse(payload);
      }
      
      navigate(`${basePath}/courses`);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.title?.[0] || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      <div className="admin-content__header">
        <h1 className="admin-content__title">{isEditing ? 'Modifier la formation' : 'Nouvelle formation'}</h1>
        <Link to={`${basePath}/courses`}><Button variant="secondary">Retour</Button></Link>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <Card style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              name="title"
              label="Titre de la formation *"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              name="slug"
              label="Slug (optionnel)"
              value={formData.slug}
              onChange={handleChange}
              helpText="Laissez vide pour auto-générer"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Input
              name="price"
              label="Prix (€)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
            
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select className="form-input form-select" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Aucune</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Niveau</label>
              <select className="form-input form-select" name="level" value={formData.level} onChange={handleChange}>
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              name="total_duration"
              label="Durée totale estimée"
              placeholder="HH:MM:SS"
              value={formData.total_duration}
              onChange={handleChange}
            />
            
            <div className="form-group">
              <label className="form-label">Statut</label>
              <select className="form-input form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="DRAFT">Brouillon (Caché)</option>
                <option value="PUBLISHED">Publié (Visible)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image de couverture</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Preview" style={{ width: '160px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ flex: 1 }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {isEditing ? 'Mettre à jour' : 'Créer la formation'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
