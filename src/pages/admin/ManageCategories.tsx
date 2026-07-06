// ============================================================
// Funnel Builders — Manage Categories Page
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as categoryApi from '../../api/categories';
import type { Category } from '../../types';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryApi.getCategories(page);
      setCategories(res.results);
      setTotalCount(res.count);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

  const handleDelete = async (slug: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      try {
        await categoryApi.deleteCategory(slug);
        loadCategories();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1 className="admin-content__title">Catégories</h1>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            {totalCount} catégories
          </div>
        </div>
        <Link to="/admin/categories/new">
          <Button variant="primary">+ Nouvelle catégorie</Button>
        </Link>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Slug</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                  <Loader />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ color: 'var(--color-text-tertiary)' }}>{cat.slug}</td>
                  <td>
                    <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.description || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                      <Link to={`/admin/categories/${cat.slug}/edit`}>
                        <Button variant="secondary" size="sm" icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" icon onClick={() => handleDelete(cat.slug, cat.name)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-tertiary)' }}>
                  Aucune catégorie trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalItems={totalCount}
        onPageChange={setPage}
        nextUrl={nextUrl}
        previousUrl={prevUrl}
      />
    </>
  );
}
