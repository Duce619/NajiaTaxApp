import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import VATCalculator from './pages/VATCalculator';
import CITCalculator from './pages/CITCalculator';
import WHTCalculator from './pages/WHTCalculator';
import PAYECalculator from './pages/PAYECalculator';
import Reminders from './pages/Reminders';
import More from './pages/More';
import Legal from './pages/Legal';

import History from './pages/History';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vat" element={<VATCalculator />} />
            <Route path="/cit" element={<CITCalculator />} />
            <Route path="/wht" element={<WHTCalculator />} />
            <Route path="/paye" element={<PAYECalculator />} />
            <Route path="/history" element={<History />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/more" element={<More />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
