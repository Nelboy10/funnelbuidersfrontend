// ============================================================
// Funnel Builders — Footer Component
// Light theme with SVG icons & newsletter section
// ============================================================

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__brand-name" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </div>
            Funnel Builders
          </div>
          <div className="footer__brand-desc">
            La plateforme de formation de référence pour maîtriser les tunnels de vente
            et développer votre activité en ligne de manière prévisible.
          </div>
        </div>
        
        <div>
          <h3 className="footer__column-title">Plateforme</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link to="/courses" className="footer__link">Catalogue des formations</Link></li>
            <li><Link to="/login" className="footer__link">Connexion</Link></li>
            <li><Link to="/register" className="footer__link">Inscription gratuite</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="footer__column-title">Légal</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><a href="#" className="footer__link">Conditions d'utilisation</a></li>
            <li><a href="#" className="footer__link">Politique de confidentialité</a></li>
            <li><a href="#" className="footer__link">Mentions légales</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="footer__column-title">Contact</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <a href="mailto:contact@funnelbuilders.fr" className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                contact@funnelbuilders.fr
              </a>
            </li>
            <li>
              <a href="#" className="footer__link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Support client
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <div>&copy; {new Date().getFullYear()} Funnel Builders. Tous droits réservés.</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="#" className="footer__social-link" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href="#" className="footer__social-link" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="footer__social-link" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" className="footer__social-link" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
