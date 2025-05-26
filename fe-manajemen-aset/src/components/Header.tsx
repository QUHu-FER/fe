import { 
  Box, 
  InputBase, 
  Avatar, 
  Badge, 
  IconButton, 
  Typography, 
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddAssetModal from './AddAssetModal';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onAssetAdded?: () => void;
}

const Header = ({ onAssetAdded }: HeaderProps) => {
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    // Emit search event untuk PeminjamanPage
    window.dispatchEvent(new CustomEvent('searchChange', { detail: value }));
  };

  // Reset search value when component mounts
  useEffect(() => {
    setSearchValue('');
    window.dispatchEvent(new CustomEvent('searchChange', { detail: '' }));
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, bgcolor: 'transparent' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
        <Button
          variant="contained"
          onClick={() => setIsAddAssetModalOpen(true)}
          sx={{
            bgcolor: '#4355B9',
            color: 'white',
            borderRadius: '50px',
            px: 3,
            py: 1,
            fontSize: '16px',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#3a489e'
            }
          }}
        >
          Tambah Aset
        </Button>

        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 10, 
          px: 3, 
          py: 1, 
          display: 'flex', 
          alignItems: 'center', 
          minWidth: 400,
          flex: 1,
          transition: 'all 0.3s ease',
          '&:focus-within': {
            boxShadow: '0 0 0 2px #4E71FF'
          }
        }}>
          <SearchIcon sx={{ color: '#222', mr: 2 }} />
          <InputBase 
            placeholder="Telusuri aset..." 
            value={searchValue}
            onChange={handleSearchChange}
            sx={{ 
              fontSize: 16, 
              width: '100%',
              '& input::placeholder': {
                color: '#666',
                opacity: 1
              }
            }} 
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}>
          <Badge badgeContent={3} color="error">
            <AssignmentIcon sx={{ fontSize: 24, color: '#666' }} />
          </Badge>
        </IconButton>
        <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' } }}>
          <Badge badgeContent={2} color="error">
            <NotificationsIcon sx={{ fontSize: 24, color: '#666' }} />
          </Badge>
        </IconButton>
        
        <Box 
          onClick={handleClick}
          sx={{ 
            bgcolor: 'white', 
            borderRadius: 10, 
            px: 2, 
            py: 1, 
            display: 'flex', 
            alignItems: 'center', 
            minWidth: 200,
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          <Avatar src="https://i.pravatar.cc/100" sx={{ width: 40, height: 40, mr: 2 }} />
          <Box>
            <Typography fontWeight="bold" fontSize={16}>nama pengguna</Typography>
            <Typography fontSize={14} color="#666">aktor</Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              width: 200,
              '& .MuiMenuItem-root': {
                fontSize: 14,
                py: 1.5
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Profil
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Pengaturan
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Keluar
          </MenuItem>
        </Menu>
      </Box>

      <AddAssetModal 
        open={isAddAssetModalOpen}
        onClose={() => setIsAddAssetModalOpen(false)}
        onSuccess={() => {
          setIsAddAssetModalOpen(false);
          onAssetAdded?.();
        }}
      />
    </Box>
  );
};

export default Header; 