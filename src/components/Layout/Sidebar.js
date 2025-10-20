import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';
import logoImage from '../../assets/images/logo.jpg';

const Sidebar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      path: '/dashboard'
    },
    {
      id: 'manage-clinics',
      label: 'Manage Clinics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
      ),
      path: '/manage-clinics'
    },
    {
      id: 'manage-labs',
      label: 'Manage labs',  
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
      ),
      path: '/manage-labs'

    },
    // {
    //   id: 'add-clinic',
    //   label: 'Add Clinic',
    //   icon: (
    //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <circle cx="12" cy="12" r="10"></circle>
    //       <line x1="12" y1="8" x2="12" y2="16"></line>
    //       <line x1="8" y1="12" x2="16" y2="12"></line>
    //     </svg>
    //   ),
    //   path: '/add-clinic'
    // }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (onToggle) {
      onToggle(!isExpanded);
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <img 
            src={logoImage}
            alt="MediVault Logo" 
            className="logo-image"
            />
          {isExpanded && (
            <div className="logo-text">
              <h3>MediVault Command</h3>
              <p>Admin Panel</p>
            </div>
          )}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isExpanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.path)}
                title={!isExpanded ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {isExpanded && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={!isExpanded ? 'Logout' : ''}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          {isExpanded && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;