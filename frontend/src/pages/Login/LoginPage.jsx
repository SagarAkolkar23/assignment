import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import AlertBanner from '../../components/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../services/apiClient';
import LoginForm from './components/LoginForm';
import { loginUser } from './services/loginService';

export default function LoginPage() {
  const { isAuthenticated, saveAuthSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const successBanner = location.state?.registeredMessage || '';

  const handleLogin = async (credentials) => {
    setError('');
    setIsSubmitting(true);
    try {
      const data = await loginUser(credentials);
      saveAuthSession({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      });
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Activity size={32} className="brand-icon" />
          <h1>Sign in to CareSync</h1>
          <p>Access patient records, doctors, and care assignments</p>
        </div>

        <AlertBanner type="success" message={successBanner} />
        <AlertBanner type="error" message={error} onClose={() => setError('')} />

        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
