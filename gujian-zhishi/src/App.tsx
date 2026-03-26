import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DiagnosisPage from './pages/DiagnosisPage';
import ComparisonPage from './pages/ComparisonPage';
import KnowledgePage from './pages/KnowledgePage';
import ShowcasePage from './pages/ShowcasePage';
import DatabasePage from './pages/DatabasePage';

import './styles/custom.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="diagnosis" element={<DiagnosisPage />} />
            <Route path="comparison" element={<ComparisonPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="showcase" element={<ShowcasePage />} />
            <Route path="database" element={<DatabasePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
