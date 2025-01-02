// api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';

// -------------------
// Existing Axios calls
// -------------------
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const getGyms = async () => {
  try {
    const response = await axios.get(`${API_URL}/gyms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

// -------------------
// Videos
// -------------------
export const uploadVideo = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/videos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const getAllVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/videos`);
    return response.data; // returns an array of video objects
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
};

export const toggleLike = async (videoId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/like`, { userId });
    return response.data; // { message: 'Video liked/unliked', likesCount: number }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add a comment to a video
export const addComment = async (videoId, commentText, userId) => {
  try {
    const response = await axios.post(`${API_URL}/videos/${videoId}/comment`, { text: commentText, userId });
    return response.data; // Returns the newly added comment
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a video
export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/${videoId}/comments`);
    return response.data; // Array of comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// -------------------
// Profile
// -------------------
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Fetch videos uploaded by a specific profile
export const getVideosByProfile = async (profileId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/profile/${profileId}/videos`);
    return response.data; // Returns an array of videos
  } catch (error) {
    console.error('Error fetching uploaded videos:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_URL}/users/${userId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
