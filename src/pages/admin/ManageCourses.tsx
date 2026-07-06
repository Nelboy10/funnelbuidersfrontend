// ============================================================
// Funnel Builders — Manage Courses Page
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as courseApi from '../../api/courses';
import type { Course } from '../../types';
import { formatDateShort, getLevelLabel, getStatusLabel } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';

export default function ManageCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const res = await courseApi.getCourses({ page });
      setCourses(res.results);
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
    loadCourses();
  }, [page]);

  const handleDelete = async (slug: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la formation "${title}" ? Cette action est irréversible.`)) {
      try {
        await courseApi.deleteCourse(slug);
        loadCourses();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1 className="admin-content__title">Formations</h1>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            {totalCount} formations au total
          </div>
        </div>
        <Link to="/admin/courses/new">
          <Button variant="primary">+ Nouvelle formation</Button>
        </Link>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Niveau</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                  <Loader />
                </td>
              </tr>
            ) : courses.length > 0 ? (
              courses.map(course => (
                <tr key={course.id}>
                  <td>
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-sm)' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{course.title}</td>
                  <td>
                    <Badge variant={course.level.toLowerCase() as any}>{getLevelLabel(course.level)}</Badge>
                  </td>
                  <td>
                    <Badge variant={course.status.toLowerCase() as any}>{getStatusLabel(course.status)}</Badge>
                  </td>
                  <td>{formatDateShort(course.created_at)}</td>
                  <td>
                    <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                      <Link to={`/admin/courses/${course.slug}/modules`} title="Gérer le contenu">
                        <Button variant="secondary" size="sm" icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </Button>
                      </Link>
                      <Link to={`/admin/courses/${course.slug}/edit`} title="Modifier">
                        <Button variant="secondary" size="sm" icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" icon onClick={() => handleDelete(course.slug, course.title)} title="Supprimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-tertiary)' }}>
                  Aucune formation trouvée.
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
