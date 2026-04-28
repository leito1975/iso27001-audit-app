import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useAudit } from './context/AuditContext';
import Auth from './components/Auth/Auth';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Audits from './pages/Audits/Audits';
import Dashboard from './pages/Dashboard/Dashboard';
import Controls from './pages/Controls/Controls';
import GapAnalysis from './pages/GapAnalysis/GapAnalysis';
import Findings from './pages/Findings/Findings';
import Risks from './pages/Risks/Risks';
import Reportes from './pages/Reportes/Reportes';
import Seguimiento from './pages/Seguimiento/Seguimiento';
import Settings from './pages/Settings/Settings';
import Requirements from './pages/Requirements/Requirements';
import Users from './pages/Users/Users';
import Activate from './pages/Activate/Activate';

function App() {
    const { isAuthenticated, loading } = useAuth();
    const { currentAuditId } = useAudit();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', background: '#0f0c29', color: '#fff',
                fontSize: '1.1rem', fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔐</div>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Allow /activate without login
        if (window.location.pathname === '/activate') {
            return <Activate />;
        }
        return <Auth />;
    }

    // If no audit is selected, show the audits management page
    if (!currentAuditId) {
        return <Audits />;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/controls" element={<Controls />} />
                    <Route path="/gap-analysis" element={<GapAnalysis />} />
                    <Route path="/findings" element={<Findings />} />
                    <Route path="/risks" element={<Risks />} />
                    <Route path="/seguimiento" element={<Seguimiento />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/requirements" element={<Requirements />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
