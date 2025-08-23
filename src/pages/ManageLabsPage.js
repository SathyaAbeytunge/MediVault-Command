import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/ManageLabsPage.css';

const ManageLabsPage = () => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch labs
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/institutions/labs');
        setLabs(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load labs. Please try again.');
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // Update status in backend
  const handleStatusChange = async (labId, newStatus) => {
    try {
      // Optimistically update UI
      setLabs(labs.map(lab =>
        lab.id === labId ? { ...lab, status: newStatus } : lab
      ));

      // Send API request to update status
      await axios.patch(`http://localhost:3000/api/v1/institutions/lab/verify/${labId}`, {
        status: newStatus
      });

    } catch (err) {
      alert('Failed to update lab status. Please try again.');
      // Revert UI on error
      setLabs(labs.map(lab =>
        lab.id === labId ? { ...lab, status: labs.find(l => l.id === labId).status } : lab
      ));
    }
  };

  const handleViewDetails = (labId) => {
    navigate(`/lab-details/${labId}`);
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch =
      lab.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || lab.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => (
    <span className={`status-badge ${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  if (loading) return <div className="loading">Loading labs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar onToggle={setIsSidebarExpanded} />
      <div className={`dashboard-content ${isSidebarExpanded ? 'expanded' : ''}`}>
        <div className="page-header">
          <h1>Manage Labs</h1>
          <button className="add-lab-btn" onClick={() => navigate('/add-lab')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add New Lab
          </button>
        </div>

        <div className="labs-container">
          <div className="filters-section">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search labs..."
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
              {filteredLabs.length} labs found
            </div>
          </div>

          <div className="table-container">
            <table className="labs-table">
              <thead>
                <tr>
                  <th>Lab Name</th>
                  <th>License No.</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabs.map(lab => (
                  <tr key={lab.id}>
                    <td>
                      <div className="lab-info">
                        <strong>{lab.institutionName}</strong>
                        <small>Est. {new Date(lab.createdAt).getFullYear()}</small>
                      </div>
                    </td>
                    <td>{lab.licenseNumber}</td>
                    <td>
                      <div className="location-info">
                        <span>{lab.city}</span>
                        <small>{lab.provinceState}</small>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span>{lab.phoneNumber}</span>
                        <small>{lab.emailAddress}</small>
                      </div>
                    </td>
                    <td>
                      <div className="status-control">
                        {getStatusBadge(lab.status)}
                        <select
                          className="status-dropdown"
                          value={lab.status}
                          onChange={(e) => handleStatusChange(lab.id, e.target.value)}
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
                          onClick={() => handleViewDetails(lab.id)}
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

            {filteredLabs.length === 0 && (
              <div className="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <h3>No labs found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLabsPage;
