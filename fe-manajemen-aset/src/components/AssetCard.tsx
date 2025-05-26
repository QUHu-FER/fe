import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';

interface AssetCardProps {
  id: string;
  nama: string;
  stok: number;
  gambar: string;
}

const AssetCard = ({ id, nama, stok, gambar }: AssetCardProps) => {
  const [qty, setQty] = useState(0);

  return (
    <Box sx={{ 
      bgcolor: '#4E71FF',
      borderRadius: '15px',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)'
      }
    }}>
      <Box sx={{ 
        width: '100%',
        height: 180,
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 2,
        bgcolor: '#fff'
      }}>
        <img 
          src={gambar || 'https://via.placeholder.com/400x300'} 
          alt={nama}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
      </Box>

      <Typography 
        fontFamily="'Poppins', sans-serif"
        fontWeight="600"
        fontSize={16}
        color="white"
        align="center"
        sx={{ mb: 1 }}
      >
        {nama}
      </Typography>

      <Typography 
        fontFamily="'Poppins', sans-serif"
        fontSize={14}
        color="#e3f2fd"
        mb={2}
      >
        Stok: {stok}
      </Typography>

      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        bgcolor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        p: 0.5
      }}>
        <IconButton 
          onClick={() => setQty(qty > 0 ? qty - 1 : 0)}
          size="small"
          sx={{ 
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.2)'
            }
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography 
          fontFamily="'Poppins', sans-serif"
          fontWeight="600"
          fontSize={16}
          color="white"
          sx={{ mx: 2 }}
        >
          {qty}
        </Typography>

        <IconButton 
          onClick={() => qty < stok && setQty(qty + 1)}
          size="small"
          sx={{ 
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.2)'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Button 
        variant="contained"
        disabled={qty === 0}
        onClick={() => {
          // TODO: Implement peminjaman aset
          console.log('Meminjam aset:', { id, qty });
        }}
        sx={{ 
          bgcolor: 'white',
          color: '#4E71FF',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: '600',
          borderRadius: '12px',
          px: 2,
          py: 0.5,
          fontSize: 13,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#f5f5f5'
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(255,255,255,0.5)',
            color: '#4E71FF'
          }
        }}
      >
        Tambahkan ke List
      </Button>
    </Box>
  );
};

export default AssetCard; 