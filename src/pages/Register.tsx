// ============================================================
// Funnel Builders — Register Page
// Light theme with SVG icons & refined copywriting
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.passwordConfirm) {
      setFieldErrors({ passwordConfirm: ['Les mots de passe ne correspondent pas.'] });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        password_confirm: formData.passwordConfirm,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      // Auto-login after successful registration
      await login({ email: formData.email, password: formData.password });
      navigate('/courses', { replace: true });
    } catch (err: any) {
      if (err.response?.data) {
        setFieldErrors(err.response.data);
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
        </div>
        <h1 className="auth-card__title">Créer votre compte</h1>
        <p className="auth-card__subtitle">Rejoignez plus de 500 entrepreneurs et accédez à toutes nos formations.</p>
        
        {error && (
          <div className="alert alert--error" style={{ marginBottom: '24px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}
        
        {fieldErrors.non_field_errors && (
          <div className="alert alert--error" style={{ marginBottom: '24px' }}>
            {fieldErrors.non_field_errors[0]}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-card__form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              name="firstName"
              label="Prénom"
              placeholder="Jean"
              value={formData.firstName}
              onChange={handleChange}
              error={fieldErrors.first_name?.[0]}
            />
            <Input
              name="lastName"
              label="Nom"
              placeholder="Dupont"
              value={formData.lastName}
              onChange={handleChange}
              error={fieldErrors.last_name?.[0]}
            />
          </div>

          <Input
            type="email"
            name="email"
            label="Adresse email"
            placeholder="vous@exemple.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email?.[0]}
            required
          />
          
          <Input
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password?.[0]}
            helpText="Minimum 8 caractères avec majuscules et chiffres."
            required
          />

          <Input
            type="password"
            name="passwordConfirm"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={fieldErrors.password_confirm?.[0]}
            required
          />
          
          <Button type="submit" variant="primary" isFullWidth isLoading={isLoading} style={{ marginTop: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Créer mon compte
          </Button>
        </form>
        
        <div className="auth-card__footer">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
