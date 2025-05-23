import { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    password: '',
    confirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Konfirmasi kata sandi tidak cocok!');
      return;
    }
    toast.success('Kata sandi berhasil diubah!');
    navigate('/reset-success');
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
        <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
            SELAMAT DATANG
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="kata sandi baru"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 5,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />
            <TextField
              required
              fullWidth
              name="confirm"
              placeholder="konfirmasi kata sandi"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 5,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
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
                background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)',
                color: '#222',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: 2,
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: 320, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* <img src="..." alt="wordcloud" style={{ width: '80%' }} /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword; 