// ============================================================
// Funnel Builders — Navbar Component
// ============================================================

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials } from '../../utils/formatters';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isInstructor, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={closeMenus}>
          <div className="navbar__brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </div>
          Funnel Builders
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            onClick={closeMenus}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            onClick={closeMenus}
          >
            Catalogue
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="navbar__actions">
          {!isAuthenticated ? (
            <div className="navbar__links">
              <Link to="/login" onClick={closeMenus}>
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/register" onClick={closeMenus}>
                <Button variant="primary">S'inscrire</Button>
              </Link>
            </div>
          ) : (
            <div className="navbar__avatar">
              <button
                className="navbar__avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" />
                ) : (
                  getUserInitials(user?.first_name || '', user?.last_name || '')
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-item" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'transparent' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)' }}>{user?.email}</div>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  
                  <Link to="/profile" className="navbar__dropdown-item" onClick={closeMenus}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Mon Profil
                  </Link>
                  
                  {isAdmin && (
                    <Link to="/admin" className="navbar__dropdown-item" onClick={closeMenus}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                      Dashboard Admin
                    </Link>
                  )}
                  
                  {isInstructor && (
                    <Link to="/instructor" className="navbar__dropdown-item" onClick={closeMenus}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                      Espace Formateur
                    </Link>
                  )}
                  
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <NavLink
          to="/"
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
          onClick={closeMenus}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/courses"
          className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
          onClick={closeMenus}
        >
          Catalogue
        </NavLink>
        
        <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />
        
        {!isAuthenticated ? (
          <>
            <Link to="/login" onClick={closeMenus} style={{ width: '100%' }}>
              <Button variant="secondary" isFullWidth>Connexion</Button>
            </Link>
            <Link to="/register" onClick={closeMenus} style={{ width: '100%' }}>
              <Button variant="primary" isFullWidth>S'inscrire</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="navbar__link" onClick={closeMenus}>
              Mon Profil
            </Link>
            {isAdmin && (
              <Link to="/admin" className="navbar__link" onClick={closeMenus}>
                Dashboard Admin
              </Link>
            )}
            {isInstructor && (
              <Link to="/instructor" className="navbar__link" onClick={closeMenus}>
                Espace Formateur
              </Link>
            )}
            <button
              className="navbar__link"
              style={{ color: 'var(--color-error)', textAlign: 'left' }}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
