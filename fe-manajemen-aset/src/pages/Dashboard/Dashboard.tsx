import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AssetCard from '../../components/AssetCard';
import { Box, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fungsi untuk refresh token
  const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    try {
      const res = await fetch('https://manpro-mansetdig.vercel.app/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.access_token) {
          sessionStorage.setItem('token', data.access_token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Gagal refresh token:', error);
      return false;
    }
  };

  // Dekripsi token sebelum digunakan
  let token = sessionStorage.getItem('token') || '';
  const encryptedToken = sessionStorage.getItem('token') || '';
  if (encryptedToken) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, 'your-secret-key');
      token = bytes.toString(CryptoJS.enc.Utf8);
      console.log('Token yang didekripsi:', token);
    } catch (error) {
      console.error('Error mendekripsi token:', error);
    }
  }

  // Ambil role user dari API /user/get_account
  const fetchUserRole = async () => {
    setIsLoading(true);
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('https://manpro-mansetdig.vercel.app/user/get_account', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 403) {
          // Coba refresh token
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            token = sessionStorage.getItem('token') || '';
            // Ulangi request
            return fetchUserRole();
          } else {
            // Gagal refresh, logout
            sessionStorage.clear();
            window.location.href = '/login';
          }
        } else {
          throw new Error(`HTTP error! Status: ${res.status}, Details: ${await res.text()}`);
        }
      }
      
      const data = await res.json();
      console.log('Data dari /user/get_account:', data);
      if (data && data.role) {
        setUserRole(data.role);
        sessionStorage.setItem('userRole', data.role);
        console.log('Role dari /user/get_account:', data.role);
      } else {
        setUserRole('user');
        console.warn('Role tidak ditemukan di response /user/get_account');
      }
    } catch (error) {
      console.error('Gagal fetch /user/get_account:', error);
      setUserRole('user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#8bb6e6' }}>
      <Sidebar userRole={userRole} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ padding: '16px', width: '25%' }}>
                <AssetCard />
              </div>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 