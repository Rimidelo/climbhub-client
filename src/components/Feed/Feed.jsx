// src/components/Feed/Feed.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { getAllVideos, toggleLike, addComment, getComments } from '../../API/api';
import { UserContext } from '../../contexts/UserContext';
import {
    Box,
    Typography,
    Paper,
    Grid2,
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
    const [, setLikeLoading] = useState({});
    const [error, setError] = useState('');
    const drawerWidth = 240; // Adjust width to taste
    console.log(videos);


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getAllVideos();
                console.log(data);

                // Fetch comments for each video
                const videosWithComments = await Promise.all(
                    data.map(async (video) => {
                        const comments = await getComments(video._id); // Fetch comments for each video
                        return { ...video, comments }; // Add comments to the video object
                    })
                );

                // Sort videos by createdAt (newest first)
                const sortedVideos = videosWithComments.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setVideos(sortedVideos);
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
            await toggleLike(videoId, user._id); // Removed the unused `response` variable
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

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                marginLeft: { xs: 0, md: `-${drawerWidth}px` },
            }}
        >
            <Box sx={{ maxWidth: '400px', width: '100%' }}>
                {error && (
                    <Typography color="error" variant="body1" align="center" gutterBottom>
                        {error}
                    </Typography>
                )}
                <Grid2
                    container
                    spacing={2}

                >
                    {videos.map((video) => (
                        <Grid2
                            xs={12} // Ensure each item takes up the full row
                            key={video._id}
                            sx={{
                                width: '100%', // Ensure the card takes full width of the container
                                maxWidth: '600px', // Enforce a consistent maximum width
                                margin: '0 auto', // Center each video card
                            }}
                        >
                            <VideoCard
                                video={video}
                                handleLike={handleLike}
                                setError={setError}
                                preloadedComments={video.comments} // Pass preloaded comments
                            />
                        </Grid2>
                    ))}
                </Grid2>
            </Box>
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
    const [showAllComments, setShowAllComments] = useState(false); // Toggle for "View all comments"
    const videoRef = useRef(null);
    console.log(comments);
    
    const colorGradingMap = {
        "Pink": "#FFC0CB",
        "Green": "#008000",
        "Yellow": "#FFFF00",
        "Red": "#FF0000",
        "Blue": "#0000FF",
        "White": "#FFFFFF",
        "Orange": "#FFA500",
        "Light Green": "#90EE90",
        "Black": "#000000"
        // Add other colors as needed
    };

    // Intersection Observer Logic
    // Intersection Observer Logic
    useEffect(() => {
        const videoElement = videoRef.current; // Store the current ref value in a variable

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    videoElement?.play();
                } else {
                    videoElement?.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // Play the video when 50% of it is visible
        });

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, []);


    const handleAddComment = async () => {
        if (commentText.trim() === '') return;

        if (!user || !user._id) {
            setError('User not logged in');
            return;
        }

        setAddingComment(true);
        try {
            // Add the new comment to the server
            await addComment(video._id, commentText.trim(), user._id);
            setCommentText(''); // Clear the input field

            // Re-fetch comments from the server
            const updatedComments = await getComments(video._id);
            setComments(updatedComments); // Update comments state
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setAddingComment(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            {/* Top Section: User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.paper', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{ mr: 2 }}
                        src={`${video?.profile?.user?.image || '/default-avatar.png'}?t=${Date.now()}`}
                    >
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ mr: 2 }}>
                        {video.profile?.user?.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {dayjs(video.createdAt).fromNow()}
                    </Typography>
                </Box>
                {video.gradingSystem === "Japanese-Colored" && colorGradingMap[video.difficultyLevel] ? (
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

            {/* Media Section: Video */}
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

            {/* Actions Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <IconButton
                    onClick={() => {
                        setIsLiked((prev) => !prev); // Optimistic toggle
                        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1)); // Adjust likes count
                        handleLike(video._id).catch(() => {
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
                    onClick={() => setShowAddComment((prev) => !prev)}
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
                {(showAllComments ? comments : comments.slice(0, 2)).map((comment) => (
                    <Box
                        key={comment._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Avatar
                            sx={{ mr: 2, width: 32, height: 32 }}
                            alt={comment.profile?.user?.name}
                            src={comment.profile?.user?.image}
                        >
                        </Avatar>
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
                        {showAllComments ? 'Hide comments' : `View all ${comments.length} comments`}
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
export { VideoCard };
export default Feed;
