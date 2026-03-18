import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import RepoAnalyzer from './pages/RepoAnalyzer';
import ReadmeGenerator from './pages/ReadmeGenerator';
import ProfileAnalyzer from './pages/ProfileAnalyzer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="repo" element={<RepoAnalyzer />} />
          <Route path="readme" element={<ReadmeGenerator />} />
          <Route path="profile" element={<ProfileAnalyzer />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
