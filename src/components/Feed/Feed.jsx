// src/components/Feed/Feed.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  getAllVideos,
  getComments,
  getUserProfile,
  toggleSaveVideo,
  toggleLike,
  addComment,
} from '../../API/api';
import { UserContext } from '../../contexts/UserContext';

// MUI
import {
  Box,
  Typography,
  Paper,
  Grid as Grid2,
  IconButton,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AnimatedChip from '../AnimatedChip/AnimatedChip';

dayjs.extend(relativeTime);

const Feed = () => {
  const { user } = useContext(UserContext);

  const [, setProfile] = useState(null);        // store user’s profile (with savedVideos)
  const [videos, setVideos] = useState([]);            // store the fetched videos
  const [savedMap, setSavedMap] = useState({});        // local map of whether each video is saved
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1) On mount, fetch user profile + videos
  useEffect(() => {
    const fetchAll = async () => {
      if (!user || !user._id) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }
      try {
        // a) fetch the user profile
        const fetchedProfile = await getUserProfile(user._id);
        setProfile(fetchedProfile);

        // b) fetch all videos
        const allVideos = await getAllVideos();

        // c) attach comments
        const videosWithComments = await Promise.all(
          allVideos.map(async (video) => {
            const comments = await getComments(video._id);
            return { ...video, comments };
          })
        );

        // d) sort newest first
        const sortedVideos = videosWithComments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setVideos(sortedVideos);

        // e) build savedMap from profile.savedVideos
        const map = {};
        sortedVideos.forEach((vid) => {
          const isInSaved = fetchedProfile.savedVideos?.some(
            (sv) => sv._id === vid._id
          );
          map[vid._id] = !!isInSaved;
        });
        setSavedMap(map);
      } catch (err) {
        console.error('Error fetching feed data:', err);
        setError('Failed to load feed.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  // 2) handleToggleSave => toggles a single video’s saved state
  const handleToggleSave = async (videoId) => {
    if (!user || !user._id) {
      setError('User not logged in.');
      return;
    }
    try {
      // OPTIONAL: immediate local update for fully "optimistic" UI
      setSavedMap((prev) => ({
        ...prev,
        [videoId]: !prev[videoId],
      }));

      // call server
      await toggleSaveVideo(videoId, user._id);

      // re-fetch the user profile to confirm which videos are saved
      const updatedProfile = await getUserProfile(user._id);
      setProfile(updatedProfile);

      // rebuild savedMap from updatedProfile
      const updatedMap = { ...savedMap };
      // if you want a thorough re-check:
      videos.forEach((vid) => {
        updatedMap[vid._id] = updatedProfile.savedVideos.some(
          (sv) => sv._id === vid._id
        );
      });
      setSavedMap(updatedMap);
    } catch (err) {
      console.error('Error toggling save:', err);
      setError('Failed to toggle save.');
      // revert if you want
    }
  };

  // 3) handleLike => optional
  const handleLike = async (videoId, isCurrentlyLiked, setLocalLiked, setLikesCount) => {
    if (!user || !user._id) {
      setError('User not logged in.');
      return;
    }
    try {
      // local immediate flip
      setLocalLiked((prev) => !prev);
      setLikesCount((prev) => (isCurrentlyLiked ? prev - 1 : prev + 1));

      await toggleLike(videoId, user._id);
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to toggle like.');
      // revert
      setLocalLiked((prev) => !prev);
      setLikesCount((prev) => (isCurrentlyLiked ? prev + 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '80vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: '400px', width: '100%' }}>
        {error && (
          <Typography color="error" variant="body1" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <Grid2 container spacing={2}>
          {videos.map((video) => (
            <Grid2
              xs={12}
              key={video._id}
              sx={{
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <VideoCard
                video={video}
                user={user}
                isSaved={!!savedMap[video._id]}
                onToggleSave={handleToggleSave}
                onLike={handleLike}
                setError={setError}
              />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

// ------------------------------------------------
// VideoCard subcomponent
// ------------------------------------------------
const VideoCard = ({ video, user, isSaved, onToggleSave, onLike, setError }) => {
  // Like local states
  const [isLiked, setIsLiked] = useState(video.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(video.likes.length);

  // Comments
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(video.comments || []);
  const [showAddComment, setShowAddComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) vid?.play();
        else vid?.pause();
      });
    };
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (vid) observer.observe(vid);
    return () => {
      if (vid) observer.unobserve(vid);
    };
  }, []);

  const handleLikeClick = () => {
    onLike(video._id, isLiked, setIsLiked, setLikesCount);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !user?._id) {
      setError('User not logged in or empty comment.');
      return;
    }
    try {
      await addComment(video._id, commentText.trim(), user._id);
      setCommentText('');
      const updated = await getComments(video._id);
      setComments(updated);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment.');
    }
  };

  // color map for difficulty
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

  return (
    <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
      {/* Top: user info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: 'background.paper',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ mr: 2 }}
            src={`${video.profile?.user?.image || '/default-avatar.png'}?t=${Date.now()}`}
          />
          <Typography variant="subtitle2" sx={{ mr: 2 }}>
            {video.profile?.user?.name || 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {dayjs(video.createdAt).fromNow()}
          </Typography>
        </Box>
        {video.gradingSystem === 'Japanese-Colored' &&
        colorGradingMap[video.difficultyLevel] ? (
          <Box
            sx={{
              width: 40,
              height: 20,
              backgroundColor: colorGradingMap[video.difficultyLevel],
            }}
          />
        ) : (
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {video.difficultyLevel}
          </Typography>
        )}
      </Box>

      {/* Video area */}
      <Box sx={{ position: 'relative', pb: '140%', bgcolor: 'black' }}>
        <video
          ref={videoRef}
          src={video.videoUrl}
          controls
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        {/* Like */}
        <IconButton onClick={handleLikeClick}>
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount} likes
        </Typography>

        {/* Comment */}
        <IconButton
          onClick={() => setShowAddComment((prev) => !prev)}
          sx={{ ml: 'auto' }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>
          {comments.length} comments
        </Typography>

        {/* Save => uses isSaved from parent’s savedMap */}
        <IconButton onClick={() => onToggleSave(video._id)} sx={{ ml: 1 }}>
          {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
      </Box>

      {/* Description + skillLevel */}
      <Box
        sx={{
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {video.description || 'No Description'}
        </Typography>
        {video.profile?.skillLevel && (
          <AnimatedChip
            label={video.profile.skillLevel}
            textColor="#fff"
            width={100}
            height={25}
          />
        )}
      </Box>

      {/* Comments list */}
      <Box sx={{ px: 2 }}>
        {/* Show just a couple by default */}
        {(showAllComments ? comments : comments.slice(0, 2)).map((comment) => (
          <Box key={comment._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{ mr: 2, width: 32, height: 32 }}
              alt={comment.profile?.user?.name}
              src={comment.profile?.user?.image}
            />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              <strong>{comment.profile?.user?.name}:</strong> {comment.text}
            </Typography>
          </Box>
        ))}
        {comments.length > 2 && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1, mb: 1, cursor: 'pointer' }}
            onClick={() => setShowAllComments((prev) => !prev)}
          >
            {showAllComments
              ? 'Hide comments'
              : `View all ${comments.length} comments`}
          </Typography>
        )}
      </Box>

      {/* Add comment */}
      {showAddComment && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            pt: 1,
            pb: 2,
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            fullWidth
          />
          <Button
            variant="text"
            color="primary"
            disabled={!commentText.trim()}
            onClick={async () => {
              try {
                await addComment(video._id, commentText.trim(), user._id);
                setCommentText('');
                const updatedComments = await getComments(video._id);
                setComments(updatedComments);
              } catch (err) {
                console.error('Error adding comment:', err);
                setError('Failed to add comment.');
              }
            }}
            sx={{ ml: 1 }}
          >
            Post
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Feed;
