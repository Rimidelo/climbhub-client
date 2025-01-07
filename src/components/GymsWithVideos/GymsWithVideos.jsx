import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { getGymsWithVideos } from "../../API/api"; // Import the new API call

const GymsWithVideos = () => {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGymsWithVideos = async () => {
            try {
                const gymsData = await getGymsWithVideos(); // Use the API call here
                setGyms(gymsData);
            } catch (error) {
                console.error("Error fetching gyms with videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGymsWithVideos();
    }, []);

    const handleGymClick = (gymId) => {
        navigate(`/gym/${gymId}/videos`);
    };

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

    if (gyms.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">No gyms with videos available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Gyms with Videos
            </Typography>
            <Grid container spacing={2}>
                {gyms.map((gym) => (
                    <Grid item xs={12} sm={6} md={4} key={gym._id}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={() => handleGymClick(gym._id)}
                        >
                            {gym.image ? (
                                <img
                                    src={gym.image}
                                    alt={gym.name}
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            ) : (
                                <Typography variant="h6" sx={{ textAlign: "center" }}>
                                    {gym.name}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default GymsWithVideos;
