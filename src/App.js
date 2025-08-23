import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AddClinicPage from './pages/AddClinicPage';
import ManageClinicsPage from './pages/ManageClinicsPage';
import ClinicDetailsPage from './pages/ClinicDetailsPage';
import ManageLabsPage from './pages/ManageLabsPage';
import './styles/colors.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-clinic" element={<AddClinicPage />} />
          <Route path="/manage-clinics" element={<ManageClinicsPage />} />
          <Route path="/manage-labs" element={<ManageLabsPage/>} />
          <Route path="/clinic-details/:clinicId" element={<ClinicDetailsPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;