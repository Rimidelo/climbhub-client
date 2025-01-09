import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    TextField,
    MenuItem,
} from "@mui/material";
import { getVideosByGym, toggleLike, getComments, addComment } from "../../API/api"; // Import necessary API calls
import VideoPopup from "../VideoPopup/VideoPopup";
import { UserContext } from '../../contexts/UserContext';


const GymVideos = () => {
    const { gymId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [vGradeFilter, setVGradeFilter] = useState(""); // Filter for V-Grading
    const [colorFilter, setColorFilter] = useState(""); // Filter for Japanese-Colored
    const [comments, setComments] = useState([]);
    const [,setError] = useState("");
    const { user } = useContext(UserContext);

    const colorGradingMap = {
        Pink: "#FFC0CB",
        Green: "#008000",
        Yellow: "#FFFF00",
        Red: "#FF0000",
        Blue: "#0000FF",
        White: "#FFFFFF",
        Orange: "#FFA500",
        "Light Green": "#90EE90",
        Black: "#000000",
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videosData = await getVideosByGym(gymId);
                setVideos(videosData);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [gymId]);

    const handleLike = async (videoId) => {
        try {
            await toggleLike(videoId, user._id);
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === videoId
                        ? { ...video, likesCount: video.likesCount + 1 }
                        : video
                )
            );
        } catch (err) {
            console.error('Error toggling like:', err);
            setError('Failed to toggle like.');
        }
    };

    const fetchComments = async (videoId) => {
        try {
            const commentsData = await getComments(videoId);
            setComments(commentsData);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to fetch comments.");
        }
    };

    const handleAddComment = async (videoId, text) => {
        try {
            await addComment(videoId, text);
            const updatedComments = await getComments(videoId);
            setComments(updatedComments);
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment.");
        }
    };

    const filteredVideos = videos.filter((video) => {
        const matchesVGrade =
            vGradeFilter === "" || video.difficultyLevel === vGradeFilter;
        const matchesColor =
            colorFilter === "" || video.difficultyLevel === colorFilter;
        return matchesVGrade && matchesColor;
    });

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Videos
            </Typography>
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                    select
                    label="Filter by V-Grade"
                    value={vGradeFilter}
                    onChange={(e) => setVGradeFilter(e.target.value)}
                    sx={{ width: "200px" }}
                >
                    <MenuItem value="">All</MenuItem>
                    {["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"].map(
                        (grade) => (
                            <MenuItem key={grade} value={grade}>
                                {grade}
                            </MenuItem>
                        )
                    )}
                </TextField>
                <TextField
                    select
                    label="Filter by Color Grade"
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    sx={{ width: "200px" }}
                >
                    <MenuItem value="">All</MenuItem>
                    {Object.entries(colorGradingMap).map(([color, hex]) => (
                        <MenuItem key={color} value={color}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 20,
                                    backgroundColor: hex,

                                }}
                            />
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Grid container spacing={2}>
                {filteredVideos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video._id}>
                        <Box
                            sx={{
                                position: "relative",
                                cursor: "pointer",
                                "&:hover": {
                                    opacity: 0.8,
                                },
                            }}
                            onClick={() => {
                                setSelectedVideo(video);
                                fetchComments(video._id);
                            }}
                        >
                            <video
                                src={video.videoUrl}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                                muted
                                playsInline
                            />
                            <Typography
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    left: 10,
                                    color: "#fff",
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    padding: "5px",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {video.gradingSystem === "Japanese-Colored" &&
                                    colorGradingMap[video.difficultyLevel] ? (
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 20,
                                            backgroundColor: colorGradingMap[video.difficultyLevel],
                                        }}
                                    />
                                ) : (
                                    video.difficultyLevel
                                )}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            {selectedVideo && (
                <VideoPopup
                    open={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    video={selectedVideo}
                    handleLike={handleLike}
                    setError={setError}
                    comments={comments}
                    handleAddComment={handleAddComment}
                    user={user}
                />
            )}
        </Box>
    );
};

export default GymVideos;
