import { Box, InputBase, Avatar, Badge, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Header = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, bgcolor: 'transparent' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <Box sx={{ bgcolor: 'white', borderRadius: 10, px: 3, py: 1, display: 'flex', alignItems: 'center', minWidth: 400 }}>
        <SearchIcon sx={{ color: '#222', mr: 2 }} />
        <InputBase placeholder="Telusuri" sx={{ fontSize: 28, width: '100%' }} />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 4 }}>
      <IconButton>
        <Badge badgeContent={3} color="error">
          <AssignmentIcon sx={{ fontSize: 36 }} />
        </Badge>
      </IconButton>
      <IconButton>
        <Badge badgeContent={2} color="error">
          <NotificationsIcon sx={{ fontSize: 36 }} />
        </Badge>
      </IconButton>
      <Box sx={{ bgcolor: 'white', borderRadius: 10, px: 2, py: 1, display: 'flex', alignItems: 'center', minWidth: 200 }}>
        <Avatar src="https://i.pravatar.cc/100" sx={{ width: 48, height: 48, mr: 2 }} />
        <Box>
          <Typography fontWeight="bold" fontSize={20}>nama pengguna</Typography>
          <Typography fontSize={16} color="#888">aktor</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default Header; 