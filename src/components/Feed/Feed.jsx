// src/components/Feed/Feed.jsx

import React, { useState, useEffect, useContext } from 'react';
import { getAllVideos, toggleLike, addComment, getComments } from '../../API/api';
import { useMediaQuery } from '@mui/material';
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
    CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Feed = () => {
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

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
            <Grid container spacing={2} direction="column" >
                {videos.map((video) => (
                    <Grid item xs={12} key={video._id} sx={{ width: isSmallScreen ? '100%' : '50%', maxWidth: '600px' }}>
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
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(preloadedComments || []); // Use preloaded comments
    const [addingComment, setAddingComment] = useState(false);
    const [showAddComment, setShowAddComment] = useState(false); // Toggle for "Add a comment"

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
        <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            {/* Top Section: User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper' }}>
                <Avatar sx={{ mr: 2 }}>
                    {video.profile?.user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" sx={{ mr: 2 }}>
                    {video.profile?.user?.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {dayjs(video.createdAt).fromNow()}
                </Typography>
            </Box>


            {/* Media Section: Video */}
            <Box sx={{ position: 'relative', pb: '140%', bgcolor: 'black' }}>
                <video
                    src={video.videoUrl}
                    controls
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

            {/* Actions Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <IconButton
                    onClick={() => {
                        setIsLiked((prev) => !prev); // Optimistic toggle
                        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1)); // Adjust likes count
                        handleLike(video._id).catch(() => {
                            // Revert optimistic update on error
                            setIsLiked((prev) => !prev);
                            setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
                        });
                    }}
                >
                    {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>

                <Typography variant="body2" sx={{ mr: 2 }}>
                    {likesCount} likes
                </Typography>
                <IconButton
                    onClick={() => setShowAddComment((prev) => !prev)} // Toggle visibility
                    sx={{ ml: 'auto' }}
                >
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {comments.length} comments
                </Typography>
            </Box>

            {/* Description Section */}
            <Box sx={{ px: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 3 }}>
                    {video.description}
                </Typography>
            </Box>

            {/* Comments Section */}
            <Box sx={{ px: 2 }}>
                {comments.slice(0, 2).map((comment) => (
                    <Box
                        key={comment._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center', // Change 'flex-start' to 'center' for vertical alignment
                            mb: 2,
                        }}
                    >
                        <Avatar
                            sx={{ mr: 2, width: 32, height: 32 }}
                            alt={comment.profile?.user?.name}
                        >
                            {comment.profile?.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            <strong>{comment.profile?.user?.name}:</strong> {comment.text}
                        </Typography>
                    </Box>
                ))}
                {comments.length > 2 && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        View all {comments.length} comments
                    </Typography>
                )}
            </Box>


            {/* Add Comment Section - Toggle Visibility */}
            {showAddComment && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        pt: 1,
                        pb: 2, // Add space at the bottom
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
                        onClick={handleAddComment}
                        disabled={addingComment}
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
