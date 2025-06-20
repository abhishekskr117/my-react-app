import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const collections = [
  {
    name: 'Prime Vandal',
    type: 'Skin',
    image: 'https://valorantstrike.com/wp-content/uploads/2020/06/Valorant-Prime-Vandal-Yellow-Variant-3.jpg', 
  },
  {
    name: 'Reaver Knife',
    type: 'Skin',
    image: 'https://th.bing.com/th/id/OIP.GuGJIrL8bQebPbWacyDA1AHaEK?r=0&rs=1&pid=ImgDetMain',
  },
  {
    name: 'Phoenix Player Card',
    type: 'Card',
    image: 'https://staticg.sportskeeda.com/editor/2022/10/31cb1-16668820113027-1920.jpg',
  },
];

export default function Collections() {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Collections</Typography>
      <Grid container spacing={2}>
        {collections.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{item.type}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
