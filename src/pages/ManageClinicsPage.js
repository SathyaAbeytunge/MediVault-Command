import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/ManageClinicsPage.css';

const ManageClinicsPage = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/institutions/clinics');
        setClinics(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load clinics. Please try again.');
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // Update status in backend
  const handleStatusChange = async (clinicId, newStatus) => {
    try {
      // Optimistically update UI
      setClinics(clinics.map(clinic =>
        clinic.id === clinicId ? { ...clinic, status: newStatus } : clinic
      ));

      // Send API request to update status
      await axios.patch(`http://localhost:3000/api/v1/institutions/clinic/verify/${clinicId}`, {
        status: newStatus
      });

    } catch (err) {
      alert('Failed to update clinic status. Please try again.');
      // Revert UI on error
      setClinics(clinics.map(clinic =>
        clinic.id === clinicId ? { ...clinic, status: clinics.find(c => c.id === clinicId).status } : clinic
      ));
    }
  };

  const handleViewDetails = (clinicId) => {
    navigate(`/clinic-details/${clinicId}`);
  };

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch =
      clinic.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || clinic.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => (
    <span className={`status-badge ${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  if (loading) return <div className="loading">Loading clinics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar onToggle={setIsSidebarExpanded} />
      <div className={`dashboard-content ${isSidebarExpanded ? 'expanded' : ''}`}>
        <div className="page-header">
          <h1>Manage Clinics</h1>
          <button className="add-clinic-btn" onClick={() => navigate('/add-clinic')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add New Clinic
          </button>
        </div>

        <div className="clinics-container">
          <div className="filters-section">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-dropdown">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="results-count">
              {filteredClinics.length} clinics found
            </div>
          </div>

          <div className="table-container">
            <table className="clinics-table">
              <thead>
                <tr>
                  <th>Clinic Name</th>
                  <th>License No.</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClinics.map(clinic => (
                  <tr key={clinic.id}>
                    <td>
                      <div className="clinic-info">
                        <strong>{clinic.institutionName}</strong>
                        <small>Est. {new Date(clinic.createdAt).getFullYear()}</small>
                      </div>
                    </td>
                    <td>{clinic.licenseNumber}</td>
                    <td>
                      <div className="location-info">
                        <span>{clinic.city}</span>
                        <small>{clinic.provinceState}</small>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span>{clinic.phoneNumber}</span>
                        <small>{clinic.emailAddress}</small>
                      </div>
                    </td>
                    <td>
                      <div className="status-control">
                        {getStatusBadge(clinic.status)}
                        <select
                          className="status-dropdown"
                          value={clinic.status}
                          onChange={(e) => handleStatusChange(clinic.id, e.target.value)}
                        >
                          <option value="verified">Verified</option>
                          <option value="unverified">Unverified</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleViewDetails(clinic.id)}
                          title="View Details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredClinics.length === 0 && (
              <div className="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <h3>No clinics found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClinicsPage;


