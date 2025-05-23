import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login/Login';
import ResetPassword from './pages/Login/ResetPassword';
import ResetSuccess from './pages/Login/ResetSuccess';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Fungsi untuk mendekripsi token
  const decryptToken = (encryptedToken: string) => {
    try {
      const secretKey = 'your-secret-key';
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting token:', error);
      return null;
    }
  };

  // Fungsi untuk me-refresh token
  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(`https://manpro-mansetdig.vercel.app/auth/refresh/${refreshToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('refresh_token', data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    return false;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const encryptedToken = sessionStorage.getItem('token');
      const refreshToken = sessionStorage.getItem('refresh_token');
      
      if (!encryptedToken || !refreshToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const token = decryptToken(encryptedToken);
        if (!token) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh_token');
          return;
        }

        const response = await fetch(`https://manpro-mansetdig.vercel.app/auth/token/${token}`);
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          const refreshed = await refreshAccessToken(refreshToken);
          if (refreshed) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh_token');
          }
        } else {
          setIsAuthenticated(false);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh_token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh_token');
      }
    };

    checkAuth();

    const interval = setInterval(async () => {
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        const refreshed = await refreshAccessToken(refreshToken);
        if (!refreshed) {
          setIsAuthenticated(false);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh_token');
        }
      }
    }, 15 * 60 * 1000); // Setiap 15 menit

    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/reset-success"
          element={<ResetSuccess />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;