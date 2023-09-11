import { FC } from 'react';
import { Typography, Grid, Box, Card } from '@mui/material';

const AboutPage: FC = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      
      style={{flexDirection:'column', minHeight: '80vh', padding: '20px' }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Web-Chess: Your Ultimate Chess Web-Platform!
        </Typography>
      </Box>
      <Card sx={{ p: '20px', maxWidth: '800px', width: '100%' }}>
        <Typography variant="body1">
          <strong>About Web-Chess:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: '10px' }}>
          Web-Chess is an innovative and immersive web-platform that brings the age-old game of
          chess to the digital world like never before. Whether you are a seasoned chess master or a
          beginner taking your first steps into the world of chess, Web-Chess has something to offer
          for players of all skill levels. Our platform aims to provide a seamless and enjoyable
          experience for chess enthusiasts worldwide.
        </Typography>

        <Typography variant="body1" sx={{ mt: '20px' }}>
          <strong>Technologies Used:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: '10px' }}>
          At Web-Chess, we take pride in using cutting-edge technologies to ensure a smooth and
          efficient user experience. Our backend is developed using GoLang with the Gin framework,
          providing a robust and high-performance foundation for all the chess-related logic and
          server-side operations. On the frontend, we leverage the power of TypeScript and React to
          build a modern, interactive, and user-friendly interface.
        </Typography>

        <Typography variant="body1" sx={{ mt: '20px' }}>
          <strong>Feedback and Support:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: '10px' }}>
          We value feedback from our users as it helps us continuously improve and evolve Web-Chess.
          If you have any suggestions, feature requests, or encounter any issues, please don't
          hesitate to reach out to our dedicated support team. Your satisfaction is our priority.
        </Typography>

        <Typography variant="body1" sx={{ mt: '20px' }}>
          <strong>About the Developer:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: '10px' }}>
          Web-Chess was developed by Egor Sukhanov, a passionate chess enthusiast and a skilled
          developer. The project was born out of the love for chess and the desire to create a unique
          platform that enhances the chess-playing experience for players worldwide. The dedication
          to innovation and technical expertise has made Web-Chess a reality, and the journey
          continues to make it even better with each passing day.
        </Typography>
      </Card>
    </Grid>
  );
};

export default AboutPage;
