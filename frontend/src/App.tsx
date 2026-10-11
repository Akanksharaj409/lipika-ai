import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { Verification } from './pages/Verification';
import { Translation } from './pages/Translation';
import { History } from './pages/History';
import { About } from './pages/About';
import { Home } from './pages/Home';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-Bleed Animated Landing Page with DyeWhorl */}
        <Route path="/" element={<Landing />} />

        {/* Split-Screen Auth Page with KeycapOrb 3D Sphere */}
        <Route path="/auth" element={<Auth />} />

        {/* Epigraphical Research Workspace Shell */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results" element={<Results />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
