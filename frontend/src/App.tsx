import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { IncidentFeedPage } from './features/incidents/IncidentFeedPage';
import { PublicSOSPage } from './features/public-sos/PublicSOSPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-y-auto min-w-0">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/incidents" element={<IncidentFeedPage />} />
                  <Route path="/gis-cop" element={<DashboardPage />} />
                  <Route path="/resources" element={<DashboardPage />} />
                  <Route path="/shelters" element={<DashboardPage />} />
                  <Route path="/hospitals" element={<DashboardPage />} />
                  <Route path="/volunteers" element={<DashboardPage />} />
                  <Route path="/intelligence" element={<DashboardPage />} />
                  <Route path="/weather" element={<DashboardPage />} />
                  <Route path="/public-sos" element={<PublicSOSPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
