import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { FleetManagement } from './pages/FleetManagement';
import { DriverManagement } from './pages/DriverManagement';
import { TripOperations } from './pages/TripOperations';
import { SafetyCenter } from './pages/SafetyCenter';
import { FinanceCenter } from './pages/FinanceCenter';
import { AIIntelligence } from './pages/AIIntelligence';
import { Administration } from './pages/Administration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ManagerDashboard />} />
        <Route path="/fleet" element={<FleetManagement />} />
        <Route path="/drivers" element={<DriverManagement />} />
        <Route path="/trips" element={<TripOperations />} />
        <Route path="/safety" element={<SafetyCenter />} />
        <Route path="/finance" element={<FinanceCenter />} />
        <Route path="/ai" element={<AIIntelligence />} />
        <Route path="/admin" element={<Administration />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
