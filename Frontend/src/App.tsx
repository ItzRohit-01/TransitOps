import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RouteGuard } from './components/auth/RouteGuard';
import { LoginPage } from './pages/LoginPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { FleetManagement } from './pages/FleetManagement';
import { DriverManagement } from './pages/DriverManagement';
import { TripOperations } from './pages/TripOperations';
import { SafetyCenter } from './pages/SafetyCenter';
import { FinanceCenter } from './pages/FinanceCenter';
import { AIIntelligence } from './pages/AIIntelligence';
import { Administration } from './pages/Administration';
import { DispatcherDashboard } from './pages/DispatcherDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <RouteGuard allowedRoles={['Manager']}>
                <ManagerDashboard />
              </RouteGuard>
            } 
          />
          <Route 
            path="/fleet" 
            element={
              <RouteGuard allowedRoles={['Manager', 'Dispatcher']}>
                <FleetManagement />
              </RouteGuard>
            } 
          />
          <Route 
            path="/drivers" 
            element={
              <RouteGuard allowedRoles={['Manager', 'Dispatcher', 'Safety']}>
                <DriverManagement />
              </RouteGuard>
            } 
          />
          <Route 
            path="/trips" 
            element={
              <RouteGuard allowedRoles={['Manager', 'Dispatcher', 'Safety', 'Analyst']}>
                <TripOperations />
              </RouteGuard>
            } 
          />
          <Route 
            path="/safety" 
            element={
              <RouteGuard allowedRoles={['Safety', 'Manager']}>
                <SafetyCenter />
              </RouteGuard>
            } 
          />
          <Route 
            path="/finance" 
            element={
              <RouteGuard allowedRoles={['Analyst', 'Manager']}>
                <FinanceCenter />
              </RouteGuard>
            } 
          />
          <Route 
            path="/ai" 
            element={
              <RouteGuard allowedRoles={['Manager', 'Analyst']}>
                <AIIntelligence />
              </RouteGuard>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <RouteGuard allowedRoles={['Manager']}>
                <Administration />
              </RouteGuard>
            } 
          />
          <Route 
            path="/dispatcher" 
            element={
              <RouteGuard allowedRoles={['Dispatcher']}>
                <DispatcherDashboard />
              </RouteGuard>
            } 
          />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
