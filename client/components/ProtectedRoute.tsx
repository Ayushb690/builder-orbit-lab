import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if subjects are configured
    const savedSubjects = localStorage.getItem("attendanceApp_subjects");
    const subjects = savedSubjects ? JSON.parse(savedSubjects) : [];
    setIsSetupComplete(subjects.length > 0);
  }, []);

  // Show loading while checking
  if (isSetupComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to setup if not complete
  if (!isSetupComplete) {
    return <Navigate to="/setup" replace />;
  }

  // Render children if setup is complete
  return <>{children}</>;
}
