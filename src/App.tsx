import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProvider } from './contexts/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const DiagnosisPage = lazy(() => import('./pages/DiagnosisPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));
const DatabasePage = lazy(() => import('./pages/DatabasePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import './styles/custom.css';

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-blue-300/70 text-sm">loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="diagnosis" element={<DiagnosisPage />} />
                <Route path="comparison" element={<ComparisonPage />} />
                <Route path="knowledge" element={<KnowledgePage />} />
                <Route path="showcase" element={<ShowcasePage />} />
                <Route path="database" element={<DatabasePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
