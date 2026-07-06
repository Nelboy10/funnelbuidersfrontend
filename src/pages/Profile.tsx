// ============================================================
// Funnel Builders — Profile Page
// Light theme with SVG icons & refined layout
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';
import { formatDateShort } from '../utils/formatters';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user]);

  if (!user) return null;

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage({ type: '', text: '' });
    setIsUpdatingInfo(true);
    
    try {
      await authApi.updateProfile({ first_name: firstName, last_name: lastName });
      await refreshProfile();
      setInfoMessage({ type: 'success', text: 'Vos informations ont été mises à jour avec succès.' });
    } catch (err) {
      setInfoMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    if (!oldPassword || !newPassword) {
      setPasswordMessage({ type: 'error', text: 'Veuillez remplir les deux champs.' });
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
      setOldPassword('');
      setNewPassword('');
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
    } catch (err: any) {
      if (err.response?.data?.old_password) {
        setPasswordMessage({ type: 'error', text: "L'ancien mot de passe est incorrect." });
      } else {
        setPasswordMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe.' });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Quick validation
    if (!file.type.startsWith('image/')) {
      setInfoMessage({ type: 'error', text: 'Veuillez sélectionner un fichier image valide.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setInfoMessage({ type: 'error', text: "L'image ne doit pas dépasser 5 Mo." });
      return;
    }
    
    setIsUploadingPhoto(true);
    setInfoMessage({ type: '', text: '' });
    
    try {
      await authApi.uploadProfilePicture(file);
      await refreshProfile();
      setInfoMessage({ type: 'success', text: 'Photo de profil mise à jour.' });
    } catch (err) {
      setInfoMessage({ type: 'error', text: "Erreur lors de l'upload de la photo." });
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profile_picture ? (
            <img src={user.profile_picture} alt="Profile" />
          ) : (
            (user.first_name?.charAt(0) || '') + (user.last_name?.charAt(0) || '')
          )}
          
          <label className="profile-avatar__upload" title="Modifier la photo">
            {isUploadingPhoto ? (
              <div className="spinner spinner--sm"></div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            )}
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handlePhotoUpload}
              ref={fileInputRef}
              disabled={isUploadingPhoto}
            />
          </label>
        </div>
        
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '8px' }}>
            {user.first_name} {user.last_name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              {user.email}
            </span>
            <span style={{ color: 'var(--color-border-hover)' }}>•</span>
            <Badge variant={user.role === 'ADMIN' ? 'primary' : 'info'}>
              {user.role === 'ADMIN' ? 'Administrateur' : 'Étudiant'}
            </Badge>
            <span style={{ color: 'var(--color-border-hover)' }}>•</span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Membre depuis le {formatDateShort(user.date_joined)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Update Info Form */}
        <div className="profile-section">
          <h2 className="profile-section__title">
            <span className="profile-section__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            Informations personnelles
          </h2>
          
          {infoMessage.text && (
            <div className={`alert alert--${infoMessage.type}`}>
              {infoMessage.text}
            </div>
          )}
          
          <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Adresse email"
              value={user.email}
              disabled
              helpText="L'adresse email ne peut pas être modifiée."
            />
            
            <Button type="submit" variant="primary" isLoading={isUpdatingInfo} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Enregistrer
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="profile-section">
          <h2 className="profile-section__title">
            <span className="profile-section__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            Sécurité du compte
          </h2>
          
          {passwordMessage.text && (
            <div className={`alert alert--${passwordMessage.type}`}>
              {passwordMessage.text}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              type="password"
              label="Mot de passe actuel"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helpText="Minimum 8 caractères."
            />
            
            <Button type="submit" variant="secondary" isLoading={isUpdatingPassword} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Modifier le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
