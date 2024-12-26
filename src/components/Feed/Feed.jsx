// src/components/Feed/Feed.jsx

import React, { useState, useEffect, useContext } from 'react';
import { getAllVideos, toggleLike, addComment, getComments } from '../../API/api';
import { UserContext } from '../../contexts/UserContext';
import {
    Box,
    Typography,
    Paper,
    Grid,
    IconButton,
    TextField,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Collapse,
    CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';

const Feed = () => {
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getAllVideos();

                // Fetch comments for each video
                const videosWithComments = await Promise.all(
                    data.map(async (video) => {
                        const comments = await getComments(video._id); // Fetch comments for each video
                        return { ...video, comments }; // Add comments to the video object
                    })
                );

                setVideos(videosWithComments);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching videos or comments:', err);
                setError('Failed to load videos and comments.');
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);


    const handleLike = async (videoId) => {
        if (!user || !user._id) {
            setError('User not logged in');
            return;
        }

        setLikeLoading((prev) => ({ ...prev, [videoId]: true }));
        try {
            const response = await toggleLike(videoId, user._id); // Pass user._id to toggleLike
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === videoId ? { ...video, likes: video.likes } : video
                )
            );
            const updatedVideos = await getAllVideos();
            setVideos(updatedVideos);
        } catch (err) {
            console.error('Error toggling like:', err);
            setError('Failed to toggle like.');
        } finally {
            setLikeLoading((prev) => ({ ...prev, [videoId]: false }));
        }
    };


    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    height: '80vh',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            {error && (
                <Typography color="error" variant="body1" align="center" gutterBottom>
                    {error}
                </Typography>
            )}
            <Grid container spacing={2}>
                {videos.map((video) => (
                    <Grid item xs={12} md={6} key={video._id}>
                        <VideoCard
                            video={video}
                            handleLike={handleLike}
                            setError={setError}
                            preloadedComments={video.comments} // Pass preloaded comments
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

const VideoCard = ({ video, handleLike, setError, preloadedComments }) => {
    const { user } = useContext(UserContext);
    const [isLiked, setIsLiked] = useState(video.likes.includes(user?._id));
    const [likesCount, setLikesCount] = useState(video.likes.length);
    const [commentOpen, setCommentOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(preloadedComments || []); // Use preloaded comments
    const [addingComment, setAddingComment] = useState(false);

    useEffect(() => {
        setIsLiked(video.likes.includes(user?._id));
        setLikesCount(video.likes.length);
    }, [video.likes, user]);

    const handleAddComment = async () => {
        if (commentText.trim() === '') return;

        if (!user || !user._id) {
            setError('User not logged in');
            return;
        }

        setAddingComment(true);
        try {
            const newComment = await addComment(video._id, commentText.trim(), user._id);
            setComments((prev) => [...prev, newComment]);
            setCommentText('');
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setAddingComment(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1">
                    <strong>{video.profile.user.username}</strong>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {dayjs(video.createdAt).format('MMMM D, YYYY h:mm A')}
                </Typography>
            </Box>
            <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <video
                    src={video.videoUrl}
                    controls
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1" gutterBottom>
                    {video.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Difficulty: {video.difficultyLevel}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Gym: {video.gym.name} - {video.gym.location}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleLike(video._id)} disabled={false}>
                    {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2">{likesCount} likes</Typography>
                <IconButton
                    onClick={() => setCommentOpen((prev) => !prev)}
                    sx={{
                        marginLeft: 'auto',
                        '&:hover': { backgroundColor: 'transparent' },
                    }}
                >
                    <ChatBubbleOutlineIcon />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        {comments.length} comments
                    </Typography>
                </IconButton>
            </Box>
            <Collapse in={commentOpen} timeout="auto" unmountOnExit>
                <Box sx={{ marginTop: 2 }}>
                    <List>
                        {comments.map((comment) => (
                            <ListItem key={comment._id} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>{comment.profile?.user?.name?.charAt(0).toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" component="span">
                                            {comment.profile?.user?.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {comment.text}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                                display="block"
                                            >
                                                {dayjs(comment.createdAt).format('MMMM D, YYYY h:mm A')}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: 1 }}
                            onClick={handleAddComment}
                            disabled={addingComment}
                        >
                            {addingComment ? <CircularProgress size={16} color="inherit" /> : 'Post'}
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};


export default Feed;
