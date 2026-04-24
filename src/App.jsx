import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import useAuthStore from './stores/authStore';
import Login from './pages/Login';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Management from './pages/Management';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import WorkOrders from './pages/WorkOrders';
import Fulfillment from './pages/Fulfillment';
import Reports from './pages/Reports';
import Automation from './pages/Automation';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const storedToken = localStorage.getItem('auth-storage');
    if (storedToken) {
      const parsed = JSON.parse(storedToken);
      if (parsed.state?.token) {
        useAuthStore.setState(parsed.state);
      }
    }
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Box display="flex" className="app-container">
        <Sidebar />
        <Box flex={1} className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/management" element={<Management />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/workorders" element={<WorkOrders />} />
            <Route path="/fulfillment" element={<Fulfillment />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
