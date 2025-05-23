import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BackHandIcon from '@mui/icons-material/BackHand';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from 'react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Peminjaman Aset',
    icon: <HandshakeIcon fontSize="large" />,
    roles: ['user', 'admin', 'master']
  },
  {
    label: 'Pengembalian Aset',
    icon: <BackHandIcon fontSize="large" />,
    roles: ['user', 'admin', 'master']
  },
  {
    label: 'Buat Akun',
    icon: <PersonAddIcon fontSize="large" />,
    roles: ['admin', 'master']
  },
  {
    label: 'Terima Aset',
    icon: <DoneAllIcon fontSize="large" />,
    roles: ['admin', 'master']
  },
  {
    label: 'Persetujuan Aset',
    icon: <CheckCircleIcon fontSize="large" />,
    roles: ['master']
  }
];

interface SidebarProps {
  userRole?: string;
}

const Sidebar = ({ userRole }: SidebarProps) => {
  useEffect(() => {
    console.log('[Sidebar] Role yang diterima:', userRole);
  }, [userRole]);
  
  // Filter menu berdasarkan role yang diterima dari API
  const filteredMenu = menuItems.filter(item => {
    if (!userRole) return false;
    console.log(`[Sidebar] Mengecek menu ${item.label} untuk role ${userRole}`);
    return item.roles.includes(userRole);
  });

  console.log('[Sidebar] Menu yang akan ditampilkan:', filteredMenu.map(m => m.label));

  return (
    <Box sx={{
      width: 340,
      background: '#5b7cf7',
      minHeight: '100vh',
      p: 3,
      borderTopRightRadius: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{
        mb: 4,
        p: 2,
        bgcolor: 'white',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%'
      }}>
        <Typography variant="h6" fontWeight="bold" color="#1976d2">ASSET MANAGEMENT</Typography>
      </Box>
      
      {/* Tampilkan role pengguna */}
      <Box sx={{
        mb: 2,
        p: 1,
        bgcolor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        width: '90%',
        textAlign: 'center'
      }}>
        <Typography variant="body1" color="white">
          Role: {userRole || 'tidak ada'}
        </Typography>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {filteredMenu.map((item, idx) => (
          <ListItem key={idx} sx={{
            mb: 2,
            borderRadius: 4,
            bgcolor: '#8bb6e6',
            color: 'white',
            fontWeight: 'bold',
            minHeight: 70
          }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 48 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={<Typography fontWeight="bold" fontSize={22}>{item.label}</Typography>} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;