// ============================================================
// Funnel Builders — Instructor Dashboard Layout
// Clean sidebar with Outlet for nested routes
// ============================================================

import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as courseApi from '../../api/courses';
import { useAuth } from '../../context/AuthContext';

export default function InstructorDashboardLayout() {
  const location = useLocation();
  const isIndex = location.pathname === '/instructor';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: 'calc(100vh - var(--navbar-height))', background: '#F9FAFB' }}>
      
      {/* Instructor Sidebar */}
      <aside className="admin-sidebar" style={{ width: 'var(--sidebar-width)', flexShrink: 0, borderRight: '1px solid var(--color-border)', background: '#FFFFFF', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        
        {/* Instructor Badge */}
        <div style={{ 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-lg)', 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
          color: 'white', 
          marginBottom: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>Espace Formateur</span>
        </div>

        <div className="admin-sidebar__title" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)' }}>Navigation</div>
        
        <NavLink 
          to="/instructor" 
          end
          className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
            color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-accent-lighter)' : 'transparent',
            fontWeight: isActive ? 700 : 500,
            textDecoration: 'none', transition: 'all var(--transition-base)',
          })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Vue d'ensemble
        </NavLink>

        <div className="admin-sidebar__title" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)' }}>Mes formations</div>
        
        <NavLink 
          to="/instructor/courses" 
          className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
            color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-accent-lighter)' : 'transparent',
            fontWeight: isActive ? 700 : 500,
            textDecoration: 'none', transition: 'all var(--transition-base)',
          })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Mes formations
        </NavLink>

        {/* Back to site link */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
          <Link 
            to="/courses"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-tertiary)',
              textDecoration: 'none', fontSize: 'var(--font-size-sm)', fontWeight: 500,
              transition: 'all var(--transition-base)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="admin-content animate-fade-in-up" style={{ flex: 1, padding: 'var(--space-8)', minWidth: 0 }}>
        {isIndex ? <InstructorOverview /> : <Outlet />}
      </main>
    </div>
  );
}


function InstructorOverview() {
  const { user } = useAuth();
  const [myCourseCount, setMyCourseCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await courseApi.getCourses();
        // Filter only instructor's own courses (those where instructor === current user)
        const myCourses = res.results.filter(c => c.instructor === user?.id);
        setMyCourseCount(myCourses.length);
      } catch (err) {
        console.error("Failed to load instructor stats");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [user]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Welcome Section */}
      <div style={{ marginBottom: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
            Bienvenue, {user?.first_name || 'Formateur'} 🎓
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
            Gérez vos formations et créez du contenu pour vos étudiants.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/instructor/courses/new" className="btn btn--primary" style={{ borderRadius: '9999px', padding: '0 20px', height: '44px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Créer une formation
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        
        <div style={{ background: '#FFFFFF', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mes formations</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, color: 'var(--color-text-primary)' }}>
            {isLoading ? '...' : myCourseCount}
          </div>
        </div>

      </div>

      {/* Quick Tips */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Comment créer une formation
        </h3>
        <ol style={{ margin: 0, padding: '0 0 0 20px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
          <li><strong>Créez une formation</strong> — Donnez-lui un titre, une description et un prix</li>
          <li><strong>Ajoutez des modules</strong> — Organisez votre contenu en chapitres</li>
          <li><strong>Ajoutez des vidéos</strong> — Collez vos liens YouTube ou uploadez des fichiers</li>
          <li><strong>Publiez</strong> — Passez le statut en "Publié" pour rendre la formation visible</li>
        </ol>
      </div>
      
    </div>
  );
}
