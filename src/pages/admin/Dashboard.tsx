// ============================================================
// Funnel Builders — Admin Dashboard Overview
// Maketou Inspiration — Clean, Solid, Indigo Accent
// ============================================================

import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as courseApi from '../../api/courses';
import * as categoryApi from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

export default function AdminDashboardLayout() {
  const location = useLocation();
  const isIndex = location.pathname === '/admin';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: 'calc(100vh - var(--navbar-height))', background: '#F9FAFB' }}>
      
      {/* Admin Sidebar */}
      <aside className="admin-sidebar" style={{ width: 'var(--sidebar-width)', flexShrink: 0, borderRight: '1px solid var(--color-border)', background: '#FFFFFF', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div className="admin-sidebar__title" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)' }}>Menu principal</div>
        
        <NavLink 
          to="/admin" 
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
        
        <div className="admin-sidebar__title" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-4)' }}>Gestion du contenu</div>
        
        <NavLink 
          to="/admin/courses" 
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
          Formations
        </NavLink>
        
        <NavLink 
          to="/admin/categories" 
          className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
            color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-accent-lighter)' : 'transparent',
            fontWeight: isActive ? 700 : 500,
            textDecoration: 'none', transition: 'all var(--transition-base)',
          })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          Catégories
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-lg)',
            color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-accent-lighter)' : 'transparent',
            fontWeight: isActive ? 700 : 500,
            textDecoration: 'none', transition: 'all var(--transition-base)',
          })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Utilisateurs
        </NavLink>
      </aside>

      {/* Admin Content Area */}
      <main className="admin-content animate-fade-in-up" style={{ flex: 1, padding: 'var(--space-8)', minWidth: 0 }}>
        {isIndex ? <AdminOverview /> : <Outlet />}
      </main>
    </div>
  );
}

function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          courseApi.getCourses(),
          categoryApi.getCategories(),
        ]);
        
        setStats({
          courses: coursesRes.count,
          categories: categoriesRes.count,
        });
      } catch (err) {
        console.error("Failed to load admin stats");
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Welcome Section */}
      <div style={{ marginBottom: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
            Bienvenue, {user?.first_name || 'Admin'} 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-md)', fontWeight: 500 }}>
            Voici un aperçu de l'activité de votre plateforme.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/courses/new" className="btn btn--primary" style={{ borderRadius: '9999px', padding: '0 20px', height: '44px', fontWeight: 700 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Créer un produit
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        
        {/* Stat Card 1 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Formations actives</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent-lighter)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, color: 'var(--color-text-primary)' }}>{stats.courses}</div>
        </div>
        
        {/* Stat Card 2 */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catégories</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent-lighter)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
          </div>
          <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, color: 'var(--color-text-primary)' }}>{stats.categories}</div>
        </div>

      </div>
      
    </div>
  );
}
