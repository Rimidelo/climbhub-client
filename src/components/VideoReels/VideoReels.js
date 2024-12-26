import React, { useEffect, useState } from 'react';
import { getAllVideos } from '../api'; // <--- the function you just wrote

function VideoReels() {
  const [videos, setVideos] = useState([]);

  // 1) Fetch all videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAllVideos();
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  // 2) Render them in a vertical feed
  return (
    <div style={styles.reelsContainer}>
      {videos.map((video) => (
        <div key={video._id} style={styles.reelItem}>
          {/* The video element */}
          <video
            src={video.videoUrl}
            style={styles.video}
            controls
            // or autoPlay muted loop if you want a "reels" style auto-play
            // autoPlay
            // muted
            // loop
          />

          {/* Info overlay or caption (description, difficulty, etc.) */}
          <div style={styles.caption}>
            <h3>{video.description}</h3>
            {video.difficultyLevel && <p>Difficulty: {video.difficultyLevel}</p>}
            <p>Uploaded by: {video.profile ? video.profile.user : 'Unknown'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoReels;

// Basic inline styles for a "Reels-like" vertical feed
const styles = {
  reelsContainer: {
    // We'll use vertical scrolling with 100vh items
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory', // ensures each item snaps into viewport if your browser supports it
  },
  reelItem: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    scrollSnapAlign: 'start', // each item snaps at the start of the container
    backgroundColor: '#000',   // background to ensure nice black behind the video
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'cover',
  },
  caption: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '8px 12px',
    borderRadius: '4px',
  },
};
