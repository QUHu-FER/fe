import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';

const AssetCard = () => {
  const [qty, setQty] = useState(0);
  return (
    <Box sx={{ bgcolor: 'linear-gradient(135deg, #4fc3f7 0%, #1976d2 100%)', borderRadius: 6, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
      <Box sx={{ width: 180, height: 180, borderRadius: 4, overflow: 'hidden', mb: 2, background: '#eee' }}>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Aset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      <Typography fontWeight="bold" fontSize={26} color="white">Nama Aset</Typography>
      <Typography fontSize={20} color="#b3e5fc" mb={1}>Stok aset</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setQty(qty > 0 ? qty - 1 : 0)} sx={{ color: 'white', bgcolor: '#1976d2', mr: 1 }}>
          <RemoveIcon />
        </IconButton>
        <Typography fontWeight="bold" fontSize={22} color="white" sx={{ mx: 2 }}>{qty}</Typography>
        <IconButton onClick={() => setQty(qty + 1)} sx={{ color: 'white', bgcolor: '#1976d2', ml: 1 }}>
          <AddIcon />
        </IconButton>
      </Box>
      <Button variant="contained" sx={{ bgcolor: 'white', color: '#1976d2', fontWeight: 'bold', borderRadius: 3, px: 3, py: 1, fontSize: 18, boxShadow: 2 }}>
        Tambahkan ke List
      </Button>
    </Box>
  );
};

export default AssetCard; 