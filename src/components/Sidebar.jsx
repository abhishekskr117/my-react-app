import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from '../stores/authStore';

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Management', icon: <BuildIcon />, path: '/management' },
  { text: 'Sales', icon: <ShoppingCartIcon />, path: '/sales' },
  { text: 'Orders', icon: <AssignmentIcon />, path: '/orders' },
  { text: 'Work Orders', icon: <BuildIcon />, path: '/workorders' },
  { text: 'Fulfillment', icon: <LocalShippingIcon />, path: '/fulfillment' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Automation', icon: <SettingsIcon />, path: '/automation' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Mushroom Farm
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
