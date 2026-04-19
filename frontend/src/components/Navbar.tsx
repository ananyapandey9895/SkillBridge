import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SkillBridge</Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/skills">Skills</Link>
            <Link to="/requests">Requests</Link>
            <Link to="/sessions">Sessions</Link>
            {user?.role === UserRole.ADMIN && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">{user?.name} · {user?.role}</span>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
