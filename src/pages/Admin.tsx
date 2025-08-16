import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin: React.FC = () => {
  const { user, userProfile } = useAuth();

  // Check if user is authenticated and is an admin
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Admin;