// VideoReels.js
import React, { useState, useEffect } from 'react';
import { getAllVideos } from '../../API/api'; 
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';

function VideoReels() {
  const [videos, setVideos] = useState([]);

  // Fetch all videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const allVideos = await getAllVideos();
        setVideos(allVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <Box
      sx={{
        // A vertical scroll feed with full screen height
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#fafafa',
      }}
    >
      {videos.map((video) => (
        <Card
          key={video._id}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100vh', 
            marginBottom: '10px',
            borderRadius: 0,
            boxShadow: 'none',
            // "Snap" each card if you want that effect:
            scrollSnapAlign: 'start', 
          }}
        >
          {/* Material UI can handle video as CardMedia if you specify component="video" */}
          <CardMedia
            component="video"
            src={video.videoUrl}
            autoPlay
            loop
            muted
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Overlay content (description, user info, etc.) */}
          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              color: '#fff',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '16px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {video.description}
            </Typography>
            {video.difficultyLevel && (
              <Typography variant="body1">
                Difficulty: {video.difficultyLevel}
              </Typography>
            )}
            {video.profile?.user && (
              <Typography variant="body2">
                Uploaded by: {video.profile.user}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default VideoReels;
