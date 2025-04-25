import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
// Login 以 default export 匯入
import Login from '../pages/Login';
import Dashboard from '../pages/dashboard';
import { ProtectedRoute } from '../pages/components/ProtectedRoute'

export const AppRoutes: React.FC = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ 'agent', 'manager' ]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/message_center"
        element={
          <ProtectedRoute allowedRoles={[ 'agent', 'manager' ]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </AuthProvider>
);