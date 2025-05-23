import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    otp: '',
  });
  const [mode, setMode] = useState<'login' | 'otp'>('login');
  const [otpSent, setOtpSent] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Fungsi untuk mengenkripsi token sebelum disimpan
  const encryptToken = (token: string) => {
    const secretKey = 'your-secret-key';
    return CryptoJS.AES.encrypt(token, secretKey).toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Mencoba login dengan username:', formData.username);
      
      // Menggunakan URLSearchParams untuk format x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('username', formData.username);
      params.append('password', formData.password);

      // Gunakan fetch untuk login
      const response = await fetch('https://manpro-mansetdig.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Invalid username or password';
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (data && data.access_token) {
        const { access_token } = data;
        const encryptedToken = encryptToken(access_token);
        sessionStorage.setItem('token', encryptedToken);
        
        // Clear dulu userRole di sessionStorage untuk memastikan mendapat role yang fresh
        sessionStorage.removeItem('userRole');
        
        // Ambil data pengguna dari API
        try {
          // Mendapatkan username dari token
          const tokenData = parseJwt(access_token);
          console.log('Token data:', tokenData);
          
          if (tokenData && tokenData.username) {
            const username = tokenData.username;
            console.log('Username dari token:', username);
            
            // Pakai fetch untuk mendapatkan info user
            const userResponse = await fetch(`https://manpro-mansetdig.vercel.app/user/${username}`, {
              headers: {
                'Authorization': `Bearer ${access_token}`
              }
            });
            
            if (!userResponse.ok) {
              const errorData = await userResponse.text();
              throw new Error(`HTTP error! Status: ${userResponse.status}, Details: ${errorData}`);
            }
            
            const userData = await userResponse.json();
            console.log('User data:', userData);
            
            if (userData && userData.role) {
              const role = userData.role;
              sessionStorage.setItem('userRole', role);
              console.log('Role dari API:', role);
            } else {
              console.warn('Tidak menemukan role dari response user API');
            }
          }
        } catch (userError) {
          console.error('Error mengambil data pengguna:', userError);
        }
        
        // Tambahkan logging untuk memeriksa token dan respons
        console.log('Token yang diterima:', data.access_token);

        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
        toast.success('Login berhasil!');
      } else {
        toast.error('Format respons tidak valid. Token tidak ditemukan.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan saat login.');
      }
    }
  };

  // Fungsi untuk parsing JWT token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };

  // Fungsi untuk request OTP
  const handleRequestOtp = async () => {
    if (!formData.username || !formData.phone) {
      toast.error('Isi nama pengguna dan nomor WhatsApp terlebih dahulu!');
      return;
    }
    // Simulasi request OTP (ganti dengan request ke backend jika ada)
    setOtpSent(true);
    toast.success('Kode OTP dikirim ke WhatsApp!');
  };

  // Fungsi untuk handle submit OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error('Masukkan kode OTP!');
      return;
    }
    // Simulasi verifikasi OTP, jika benar redirect ke halaman reset password
    toast.success('Kode OTP benar! Silakan ubah kata sandi.');
    navigate('/reset-password');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4fc3f7 0%, #1976d2 100%)'
    }}>
      <Box sx={{
        display: 'flex',
        borderRadius: 6,
        boxShadow: 3,
        overflow: 'hidden',
        bgcolor: 'white'
      }}>
        {/* Kiri: Form Login/OTP */}
        <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {mode === 'login' ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{
                  mb: 4,
                  fontWeight: 'bold',
                  color: '#1976d2',
                }}
              >
                SELAMAT DATANG
              </Typography>
              <TextField
                required
                fullWidth
                id="username"
                placeholder="nama pengguna"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <TextField
                required
                fullWidth
                name="password"
                placeholder="kata sandi"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                Masuk
              </Button>
              <Link
                href="#"
                variant="body2"
                align="center"
                sx={{
                  color: '#666',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => setMode('otp')}
              >
                Lupa kata sandi?
              </Link>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleOtpSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{
                  mb: 4,
                  fontWeight: 'bold',
                  color: '#1976d2',
                }}
              >
                SELAMAT DATANG
              </Typography>
              <TextField
                required
                fullWidth
                id="username"
                placeholder="nama pengguna"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span role="img" aria-label="user">👤</span>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                fullWidth
                id="phone"
                placeholder="No Telpon / WhatsApp"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span role="img" aria-label="phone">📞</span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="kirim otp"
                        onClick={handleRequestOtp}
                        edge="end"
                        disabled={otpSent}
                      >
                        <span role="img" aria-label="send">📨</span>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                fullWidth
                id="otp"
                placeholder="Masukkan Kode OTP"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 5,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 1,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)',
                  color: '#222',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  boxShadow: 2,
                }}
              >
                Kirim
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mb: 1,
                  py: 1.5,
                  color: '#1976d2',
                  borderColor: '#1976d2',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
                onClick={() => setMode('login')}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
        {/* Kanan: Ilustrasi/Wordcloud */}
        <Box sx={{
          width: 320,
          background: '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* <img src="..." alt="wordcloud" style={{ width: '80%' }} /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;