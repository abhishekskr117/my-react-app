import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from '@mui/material';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const achievements = [
  {
    title: '100 Headshots',
    progress: 75,
    icon: <FaceRetouchingNaturalIcon color="primary" />,
  },
  {
    title: 'Win 50 Matches',
    progress: 40,
    icon: <EmojiEventsIcon color="success" />,
  },
  {
    title: 'Unlock 10 Skins',
    progress: 100,
    icon: <CheckCircleIcon color="action" />,
  },
];

export default function Achievements() {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Achievements</Typography>
      <List>
        {achievements.map((achievement, index) => (
          <ListItem key={index}>
            <ListItemIcon>{achievement.icon}</ListItemIcon>
            <ListItemText
              primary={achievement.title}
              secondary={
                <Box width="100%" mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={achievement.progress}
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
