import { useState } from 'react';

export default function RegisterForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          name="name"
          type="text"
          required
          placeholder="Dr. Alice Smith"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="register-email">Email Address</label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          placeholder="alice@example.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Minimum 8 characters"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
