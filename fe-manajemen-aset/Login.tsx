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
        navigate('/dashboard');
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
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#6CA2DF',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Box
        component="img"
        src="/src/assets/form login dan forgot dan animasi/wp2.png"
        alt="Wallpaper"
        sx={{
          width: '488px',
          height: '426px',
          position: 'absolute',
          top: '268px',
          left: 'calc(50% - 244px)',
          transform: 'rotate(-90deg)',
          borderRadius: '40px',
          zIndex: -2
        }}
      />
      <Box
        component="img"
        src="/src/assets/Rectangle/Rectangle 5.png"
        alt="Rectangle 5"
        sx={{
          width: '459px',
          height: '488px',
          position: 'absolute',
          top: '268px',
          left: '627px',
          borderRadius: '40px',
          boxShadow: '4px 4px 4px 0px #00000066',
          zIndex: -1
        }}
      />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <Box
          sx={{
            width: '374px',
            height: '488px',
            borderRadius: '40px',
            background: 'linear-gradient(217.64deg, #1984FF -5.84%, #5DC1FF 106.73%)',
            boxShadow: '-4px 4px 4px 0px #00000040',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/src/assets/Rectangle 6.png"
            alt="Rectangle 6"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '417px',
              left: '386px',
              width: '303px',
              height: '63px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Lalezar',
                fontSize: '40px',
                color: '#FFF',
                fontWeight: 400,
                letterSpacing: 0,
                lineHeight: '100%',
                textAlign: 'center',
              }}
            >
              SELAMAT DATANG
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              px: 3,
            }}
          >
            <TextField
              required
              fullWidth
              id="username"
              placeholder="nama pengguna"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="img" src="/src/assets/form peminjaman_pengembalian_buat akun_terima aset_persetujuan/🦆 icon _User Plus_.png" sx={{ width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '282px',
                height: '36px',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  p: '8px',
                  fontSize: '14px',
                }
              }}
            />

            <TextField
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="kata sandi"
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="img" src="/src/assets/form peminjaman_pengembalian_buat akun_terima aset_persetujuan/power.png" sx={{ width: 20, height: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: '#fff' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '282px',
                height: '36px',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  '& fieldset': { border: 'none' }
                },
                '& .MuiInputBase-input': {
                  p: '8px',
                  fontSize: '14px',
                }
              }}
            />

            <Button
              type="submit"
              sx={{
                width: '91px',
                height: '36px',
                bgcolor: '#1976D2',
                color: '#fff',
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                mt: 1,
                mb: 1,
                background: 'linear-gradient(90deg, #5DC1FF 0%, #1984FF 100%)',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1565C0'
                }
              }}
            >
              Masuk
            </Button>

            <Link
              component="button"
              onClick={() => setMode('otp')}
              sx={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontFamily: 'Inter',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Lupa kata sandi?
            </Link>
          </Box>
        </Box>

        <Box sx={{
          width: '374px',
          height: '488px',
          borderRadius: '40px',
          background: 'linear-gradient(217.64deg, #1984FF -5.84%, #5DC1FF 106.73%)',
          boxShadow: '-4px 4px 4px 0px #00000040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box
            component="img"
            src="/src/assets/Rectangle 8.png"
            alt="Rectangle 8"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Poppins',
              fontSize: '48px',
              color: '#FFFFFF',
              fontWeight: 800
            }}
          >
            ASETARY
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;