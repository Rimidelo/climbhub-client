import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Modal,
  Avatar,
  TextField,
  Button,
  Paper,
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// Removed IosShareIcon import
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // NEW: For "Save" button

import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import { UserContext } from '../../contexts/UserContext';
import {
  getVideosByPreferences,
  getComments,
  toggleLike,
  addComment,
  toggleSaveVideo,
  getUserProfile
} from '../../API/api';

import AnimatedChip from '../AnimatedChip/AnimatedChip';

// Color mapping for grading system
const colorGradingMap = {
  Pink: '#FFC0CB',
  Green: '#008000',
  Yellow: '#FFFF00',
  Red: '#FF0000',
  Blue: '#0000FF',
  White: '#FFFFFF',
  Orange: '#FFA500',
  'Light Green': '#90EE90',
  Black: '#000000',
};

const Reels = () => {
  const { user } = useContext(UserContext);

  const [, setProfile] = useState(null);
  const [videos, setVideos] = useState([]); // All videos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null); // For comments modal
  const [commentText, setCommentText] = useState('');       // New comment input
  const [paused, setPaused] = useState({});                 // Whether a video is paused
  const [showStatusIcon, setShowStatusIcon] = useState({}); // Play/Pause overlay icons

  // NEW: local "saved" state keyed by videoId. True => user saved it, false => unsaved
  const [savedState, setSavedState] = useState({});

  const videoRefs = useRef([]);
  console.log(user);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user || !user._id) {
        // handle error or show "please log in"
        setError('User not logged in.');
        // We need to stop loading here too
        setLoading(false);
        return;
      }

      try {
        // 1) Fetch the *full* user profile so we get savedVideos
        const fullProfile = await getUserProfile(user._id);
        setProfile(fullProfile);

        // 2) Fetch videos by preferences
        const { preferredVideos, otherVideos } = await getVideosByPreferences(user._id);
        const allVideos = [...preferredVideos, ...otherVideos];

        // 3) For each video, fetch comments
        const videosWithComments = await Promise.all(
          allVideos.map(async (video) => {
            const comments = await getComments(video._id);
            return { ...video, comments };
          })
        );

        setVideos(videosWithComments);

        // 4) Now we can see which videos are saved
        const initialSavedState = {};
        videosWithComments.forEach((vid) => {
          const isSaved = fullProfile.savedVideos?.some(
            (sv) => sv._id === vid._id
          );
          initialSavedState[vid._id] = isSaved;
        });
        setSavedState(initialSavedState);
      } catch (err) {
        console.error('Error fetching data in Reels:', err);
        setError('Failed to load data.');
      } finally {
        // ALWAYS set loading to false, whether success or error
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  // IntersectionObserver to auto-play/pause
  useEffect(() => {
    if (!videos.length) return;

    const options = { root: null, threshold: 0.75 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoEl = entry.target;
        if (entry.isIntersecting) {
          videoEl
            .play()
            .catch((err) => {
              console.warn('Cannot play video', err);
            });
        } else {
          videoEl.pause();
        }
      });
    }, options);

    videoRefs.current.forEach((videoEl) => {
      if (videoEl) observer.observe(videoEl);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // Play/pause toggling
  const handleTogglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (paused[index]) {
        video.play();
        setShowStatusIcon({ [index]: 'play' });
      } else {
        video.pause();
        setShowStatusIcon({ [index]: 'pause' });
      }
      setPaused((prev) => ({ ...prev, [index]: !prev[index] }));
      setTimeout(() => setShowStatusIcon({ [index]: null }), 1000);
    }
  };

  // Toggle Like
  const handleLike = async (videoId) => {
    if (!user || !user._id) {
      setError('Please log in to like videos.');
      return;
    }
    try {
      await toggleLike(videoId, user._id);
      setVideos((prev) =>
        prev.map((video) => {
          if (video._id !== videoId) return video;

          const isLiked = video.likes.includes(user._id);
          let updatedLikes = [...video.likes];
          if (isLiked) {
            updatedLikes = updatedLikes.filter((uid) => uid !== user._id);
          } else {
            updatedLikes.push(user._id);
          }
          return {
            ...video,
            likes: updatedLikes,
            likesCount: updatedLikes.length,
          };
        })
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to toggle like.');
    }
  };

  // Toggle Save (replaces the share button)
  const handleToggleSave = async (videoId, e) => {
    e.stopPropagation(); // Prevent click from toggling play/pause

    if (!user || !user._id) {
      setError('User not logged in');
      return;
    }
    try {
      // Call the API to toggle saving the video
      await toggleSaveVideo(videoId, user._id);

      // Optimistic UI update
      setSavedState((prev) => ({
        ...prev,
        [videoId]: !prev[videoId],
      }));
    } catch (err) {
      console.error('Error toggling save:', err);
      setError('Failed to toggle save.');
    }
  };

  // Show comments
  const handleShowComments = (video) => {
    setSelectedVideo(video);
  };
  const handleCloseComments = () => {
    setSelectedVideo(null);
  };

  // Add comment (with immediate user image display)
  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedVideo) return;

    try {
      // 1) Post the new comment to the backend
      const newComment = await addComment(selectedVideo._id, commentText.trim(), user._id);

      // 2) If your server doesn't return a fully populated comment, manually attach user data:
      //    (If your server already returns .profile.user.image, you can skip this step.)
      const newCommentPopulated = {
        ...newComment,
        profile: {
          ...newComment.profile,
          user: {
            // fallback to newComment.profile?.user, or override with local user data
            ...newComment.profile?.user,
            image: newComment.profile?.user?.image || user.image,
            name: newComment.profile?.user?.name || user.name,
          },
        },
      };

      // 3) Update the main videos array
      setVideos((prev) =>
        prev.map((video) => {
          if (video._id !== selectedVideo._id) return video;
          return {
            ...video,
            comments: [...video.comments, newCommentPopulated],
          };
        })
      );

      // 4) Update `selectedVideo` so the modal shows the new comment immediately
      setSelectedVideo((prevVideo) => {
        if (!prevVideo) return null;
        return {
          ...prevVideo,
          comments: [...prevVideo.comments, newCommentPopulated],
        };
      });

      // 5) Clear the text field
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment.');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="black"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        '::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        bgcolor: 'black',
      }}
    >
      {error && (
        <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {videos.map((video, index) => {
        const isLiked = user && video.likes.includes(user._id);
        // If we haven't set a local savedState for this video yet, fallback to false
        const isSaved = !!savedState[video._id];

        return (
          <Paper
            key={video._id || index}
            elevation={3}
            sx={{
              height: '100vh',
              scrollSnapAlign: 'start',
              display: 'flex',
              position: 'relative',
              flexDirection: 'column', // Arrange children vertically
              justifyContent: 'flex-start', // Align children to the top
              bgcolor: 'black',
            }}
            onClick={() => handleTogglePlayPause(index)}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '90%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Skill Level Chip */}
              {video.profile?.skillLevel && (
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                  <AnimatedChip
                    label={video.profile.skillLevel}
                    textColor="#fff"
                    width={100}
                    height={30}
                  />
                </Box>
              )}

              {/* Grading Indicator */}
              {video.gradingSystem === 'Japanese-Colored' &&
                colorGradingMap[video.difficultyLevel] ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 20,
                    backgroundColor: colorGradingMap[video.difficultyLevel],
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  {video.difficultyLevel}
                </Typography>
              )}

              {/* Play/Pause Overlay Icons */}
              {showStatusIcon[index] === 'pause' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <PauseCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
              )}
              {showStatusIcon[index] === 'play' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <PlayCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
              )}

              {/* The Video Element */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.videoUrl}
                loop
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                }}
              />

              {/* Video Description and User Info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  color: '#fff',
                  zIndex: 5,
                  pr: '60px',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {video?.profile?.user?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {video.description || 'No Description'}
                </Typography>
              </Box>

              {/* Action Buttons (Right side) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 80,
                  right: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  color: '#fff',
                  zIndex: 5,
                }}
              >
                {/* Like Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(video._id);
                    }}
                    sx={{ color: 'white' }}
                  >
                    {isLiked ? (
                      <FavoriteIcon sx={{ fontSize: 28, color: 'red' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {video.likesCount || video.likes.length || 0}
                  </Typography>
                </Box>

                {/* Comment Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowComments(video);
                    }}
                    sx={{ color: 'white' }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                  <Typography variant="body2">{video.comments?.length || 0}</Typography>
                </Box>

                {/* SAVE Button (replaces the old share button) */}
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton
                    onClick={(e) => handleToggleSave(video._id, e)}
                    sx={{ color: 'white' }}
                  >
                    {isSaved ? (
                      <BookmarkIcon sx={{ fontSize: 28 }} />
                    ) : (
                      <BookmarkBorderIcon sx={{ fontSize: 28 }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Paper>
        );
      })}

      {/* Comments Modal */}
      <Modal open={!!selectedVideo} onClose={handleCloseComments}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {selectedVideo?.comments.map((comment, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={comment.profile?.user?.image}
                  alt={comment.profile?.user?.name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.profile?.user?.name}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              placeholder="Add a comment..."
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Reels;
