// ============================================================
// Funnel Builders — Courses Catalog Page
// Light theme with SVG icons & refined copywriting
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as courseApi from '../api/courses';
import * as categoryApi from '../api/categories';
import type { Course, Category, CourseLevel } from '../types';
import { formatPrice, formatDuration, getLevelLabel } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters from URL
  const page = parseInt(searchParams.get('page') || '1', 10);
  const categoryFilter = searchParams.get('category') || '';
  const levelFilter = searchParams.get('level') || '';
  const searchFilter = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchFilter);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const catRes = await categoryApi.getCategories();
        setCategories(catRes.results);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      try {
        const res = await courseApi.getCourses({
          page,
          category: categoryFilter ? parseInt(categoryFilter, 10) : undefined,
          level: levelFilter as CourseLevel || undefined,
          search: searchFilter || undefined,
          // Only fetching PUBLISHED is handled by backend for STUDENTS/anonymous
        });
        setCourses(res.results);
        setTotalCount(res.count);
        setNextUrl(res.next);
        setPrevUrl(res.previous);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [page, categoryFilter, levelFilter, searchFilter]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter change
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchInput);
  };

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>Catalogue de formations</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)' }}>
          Des parcours complets pour chaque étape de votre croissance.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <form onSubmit={handleSearchSubmit} className="filters-bar__search">
          <svg className="filters-bar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <Input
            placeholder="Rechercher une formation..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </form>
        
        <select
          className="form-input form-select filters-bar__select"
          value={categoryFilter}
          onChange={(e) => updateFilters('category', e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          className="form-input form-select filters-bar__select"
          value={levelFilter}
          onChange={(e) => updateFilters('level', e.target.value)}
        >
          <option value="">Tous les niveaux</option>
          <option value="BEGINNER">Débutant</option>
          <option value="INTERMEDIATE">Intermédiaire</option>
          <option value="ADVANCED">Avancé</option>
        </select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="course-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} style={{ padding: 0 }}>
              <div className="skeleton skeleton--image" style={{ borderRadius: 0 }} />
              <div style={{ padding: 'var(--space-5)' }}>
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--text" style={{ width: '100%' }} />
                <div className="skeleton skeleton--text" style={{ width: '80%', marginBottom: '24px' }} />
                <div className="skeleton skeleton--text" style={{ width: '30%' }} />
              </div>
            </Card>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="course-grid">
            {courses.map((course) => (
              <Link to={`/courses/${course.slug}`} key={course.id} style={{ color: 'inherit' }}>
                <Card interactive style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="card__image" />
                  ) : (
                    <div className="card__image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line><line x1="17" y1="17" x2="22" y2="17"></line></svg>
                    </div>
                  )}
                  
                  <div className="card__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <Badge variant={course.level.toLowerCase() as any}>
                        {getLevelLabel(course.level)}
                      </Badge>
                      {categories.find(c => c.id === course.category) && (
                        <Badge variant="primary">
                          {categories.find(c => c.id === course.category)?.name}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {course.title}
                    </h3>
                    
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.description}
                    </p>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {formatDuration(course.total_duration) || '--'}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: course.price === '0.00' ? 'var(--color-success)' : 'var(--color-accent-primary)' }}>
                        {formatPrice(course.price)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <Pagination
            currentPage={page}
            totalItems={totalCount}
            pageSize={10}
            onPageChange={(p) => updateFilters('page', String(p))}
            nextUrl={nextUrl}
            previousUrl={prevUrl}
          />
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 className="empty-state__title">Aucune formation trouvée</h3>
          <p className="empty-state__description">
            Essayez de modifier vos filtres ou d'utiliser d'autres termes de recherche.
          </p>
          <Button variant="secondary" onClick={() => setSearchParams({})}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
