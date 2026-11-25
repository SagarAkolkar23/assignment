import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Link2, LogOut, Stethoscope, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="brand" style={{ textDecoration: 'none' }}>
            <Activity size={22} className="brand-icon" />
            <span>CareSync</span>
          </NavLink>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/patients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={16} />
              Patients
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Stethoscope size={16} />
              Doctors
            </NavLink>
            <NavLink to="/mappings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Link2 size={16} />
              Mappings
            </NavLink>
          </nav>

          <div className="nav-user">
            <span className="user-pill">{user?.name || user?.email || 'Authenticated User'}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        <Outlet />
      </main>
    </div>
  );
}
