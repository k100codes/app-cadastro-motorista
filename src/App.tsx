import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage.tsx';
import CadastroPage from './pages/CadastroPage.tsx';
import StatusPage from './pages/StatusPage.tsx';
import AdminLoginPage from './pages/AdminLoginPage.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;