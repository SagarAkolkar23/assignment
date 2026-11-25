import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import AlertBanner from '../../components/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../services/apiClient';
import RegisterForm from './components/RegisterForm';
import { registerUser } from './services/registerService';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (payload) => {
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser(payload);
      navigate('/login', {
        replace: true,
        state: { registeredMessage: 'Account created! Please sign in with your credentials.' },
      });
    } catch (err) {
      setError(extractErrorMessage(err, 'Unable to register account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Activity size={32} className="brand-icon" />
          <h1>Create CareSync Account</h1>
          <p>Register to manage patients, doctors, and care teams</p>
        </div>

        <AlertBanner type="error" message={error} onClose={() => setError('')} />

        <RegisterForm onSubmit={handleRegister} isSubmitting={isSubmitting} />

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
