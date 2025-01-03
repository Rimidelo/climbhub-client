import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { addComment, toggleLike, getComments, deleteVideo } from '../../API/api';
import CommentsOverlay from '../CommentsOverlay/CommentsOverlay';

const VideoPopup = ({ open, onClose, video, user }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const videoRef = useRef(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // 3-dot menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Overlay for mobile comments
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    if (open && video) {
      setIsLiked(video.likes?.includes(user?._id) || false);
      setLikesCount(video.likes?.length || 0);

      const fetchComments = async () => {
        try {
          const fetchedComments = await getComments(video._id);
          setComments(fetchedComments);
        } catch (error) {
          console.error('Error fetching comments:', error);
        } finally {
          setLoadingComments(false);
        }
      };

      fetchComments();

      // Play the video when the popup opens
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.error('Error playing video:', err);
        });
      }
    }
  }, [open, video, user]);

  const handleLike = async () => {
    if (!video) return;
    try {
      await toggleLike(video._id, user._id);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    await deleteVideo(video._id);
    console.log('Delete video with ID:', video._id);
    handleMenuClose();
    onClose();
  };

  // Mobile Comments Overlay
  const openCommentsOverlay = () => setIsCommentsOpen(true);
  const closeCommentsOverlay = () => setIsCommentsOpen(false);

  const handleAddComment = async (commentText) => {
    if (!video || !commentText.trim()) return;
    try {
      await addComment(video._id, commentText.trim(), user._id);
      const updatedComments = await getComments(video._id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!open || !video) return null;

  return (
    /**
     * OUTER BACKDROP:
     * - Clicking here closes the modal.
     */
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
      }}
    >
      {/**
       * INNER CONTAINER:
       * - Stop click events from bubbling up to the backdrop.
       * - Keep your X button exactly where it is.
       */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 1100,
          maxHeight: '95%',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          position: 'relative',
        }}
      >
        {/* (A) Close Button — same position as before */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* (B) VIDEO SECTION */}
        <Box
          sx={{
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: isDesktop ? '100%' : '90vh',
          }}
        >
          <video
            src={video.videoUrl}
            controls
            ref={videoRef}
            style={{
              maxWidth: isDesktop ? '100%' : '70%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* (C) DESKTOP COMMENTS SECTION */}
        {isDesktop && (
          <Box
            sx={{
              flexBasis: '40%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #444',
            }}
          >
            {/* USER BAR + 3-DOT MENU */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid #444',
                color: '#fff',
              }}
            >
              <Avatar
                src={`${video?.profile?.user?.image || '/default-avatar.png'}?t=${Date.now()}`}
                alt={video.profile?.user?.name}
                sx={{ mr: 1 }}
              />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                {video.profile?.user?.name}
              </Typography>
              <IconButton onClick={handleMenuOpen} sx={{ color: '#fff',marginRight: '2rem' }}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#333',
                    color: '#fff',
                  },
                }}
              >
                <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                  Delete
                </MenuItem>
              </Menu>
            </Box>

            {/* SCROLLABLE COMMENTS */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, color: '#fff' }}>
              {video.description && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                  {video.description}
                </Typography>
              )}
              {loadingComments ? (
                <Typography variant="body2">Loading comments...</Typography>
              ) : comments.length > 0 ? (
                comments.map((comment, i) => (
                  <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                    <Avatar
                      src={comment.profile?.profilePicture}
                      alt={comment.profile?.user?.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Box sx={{ color: '#fff' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {comment.profile?.user?.name}
                      </Typography>
                      <Typography variant="body2">{comment.text}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No comments yet.</Typography>
              )}
            </Box>

            {/* LIKE ROW */}
            <Box
              sx={{
                borderTop: '1px solid #444',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
              }}
            >
              <IconButton onClick={handleLike} sx={{ color: '#fff' }}>
                {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>

            {/* ADD COMMENT ROW */}
            <Box
              sx={{
                borderTop: '1px solid #444',
                p: 2,
                display: 'flex',
                gap: 1,
              }}
            >
              <CommentsOverlay.AddCommentInput onAddComment={handleAddComment} />
            </Box>
          </Box>
        )}

        {/* (D) MOBILE COMMANDS BAR */}
        {!isDesktop && (
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: '#fff',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}
          >
            {/* LEFT: LIKE BUTTON & COUNT */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleLike} sx={{ color: '#fff', mr: 1 }}>
                {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography variant="body2">
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>

            {/* RIGHT: COMMENT ICON + VIEW ALL X COMMENTS */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={openCommentsOverlay} sx={{ color: '#fff' }}>
                <ChatBubbleOutlineIcon />
              </IconButton>
              {comments.length > 0 && (
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                  onClick={openCommentsOverlay}
                >
                  View all {comments.length} comments
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* COMMENTS OVERLAY (Mobile) */}
      <CommentsOverlay
        open={isCommentsOpen}
        onClose={closeCommentsOverlay}
        video={video}
        user={user}
        comments={comments}
        loadingComments={loadingComments}
        handleAddComment={handleAddComment}
      />
    </Box>
  );
};

export default VideoPopup;
