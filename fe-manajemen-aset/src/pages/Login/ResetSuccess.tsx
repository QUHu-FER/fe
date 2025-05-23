import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResetSuccess = () => {
  const navigate = useNavigate();
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
        <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
            Kata Sandi Berhasil Diubah!
          </Typography>
          <Button
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
            onClick={() => navigate('/login')}
          >
            Kembali untuk Masuk
          </Button>
        </Box>
        <Box sx={{ width: 320, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* <img src="..." alt="wordcloud" style={{ width: '80%' }} /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default ResetSuccess; 