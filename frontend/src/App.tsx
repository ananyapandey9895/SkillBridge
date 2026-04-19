import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Requests from './pages/Requests';
import SessionDetail from './pages/SessionDetail';
import Sessions from './pages/Sessions';
import Skills from './pages/Skills';

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider delay={300}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="skills" element={<Skills />} />
            <Route path="requests" element={<Requests />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="sessions/:id" element={<SessionDetail />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" richColors={false} />
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
