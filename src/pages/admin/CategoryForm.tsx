// ============================================================
// Funnel Builders — Category Form
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as categoryApi from '../../api/categories';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function CategoryForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!isEditing || !slug) return;
      try {
        const cat = await categoryApi.getCategory(slug);
        setFormData({
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
        });
        if (cat.image) setImagePreview(cat.image);
      } catch (err) {
        setError('Erreur lors du chargement.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = { ...formData, image: imageFile };
      if (isEditing && slug) {
        await categoryApi.updateCategory(slug, payload);
      } else {
        await categoryApi.createCategory(payload);
      }
      navigate('/admin/categories');
    } catch (err: any) {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      <div className="admin-content__header">
        <h1 className="admin-content__title">{isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h1>
        <Link to="/admin/categories"><Button variant="secondary">Retour</Button></Link>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Input name="name" label="Nom *" value={formData.name} onChange={handleChange} required />
          <Input name="slug" label="Slug" value={formData.slug} onChange={handleChange} helpText="Laissez vide pour auto-générer" />
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input form-textarea" value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ flex: 1 }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {isEditing ? 'Mettre à jour' : 'Créer la catégorie'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
