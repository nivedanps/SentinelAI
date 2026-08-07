import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

import { DashboardPage } from '../pages/DashboardPage';
import { IncidentsPage } from '../pages/IncidentsPage';
import { IncidentCreatePage } from '../pages/IncidentCreatePage';
import { IncidentDetailPage } from '../pages/IncidentDetailPage';
import { IncidentEditPage } from '../pages/IncidentEditPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { SheltersPage } from '../pages/SheltersPage';
import { VolunteersPage } from '../pages/VolunteersPage';
import { WeatherPage } from '../pages/WeatherPage';
import { AIPage } from '../pages/AIPage';
import { GISPage } from '../pages/GISPage';
import { ReportsPage } from '../pages/ReportsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { UsersPage } from '../pages/UsersPage';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'incidents',
        children: [
          { index: true, element: <IncidentsPage /> },
          { path: 'new', element: <IncidentCreatePage /> },
          { path: ':id/edit', element: <IncidentEditPage /> },
          { path: ':id', element: <IncidentDetailPage /> },
        ],
      },
      {
        path: 'resources',
        element: <ResourcesPage />,
      },
      {
        path: 'shelters',
        element: <SheltersPage />,
      },
      {
        path: 'volunteers',
        element: <VolunteersPage />,
      },
      {
        path: 'weather',
        element: <WeatherPage />,
      },
      {
        path: 'ai',
        element: <AIPage />,
      },
      {
        path: 'gis',
        element: <GISPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
