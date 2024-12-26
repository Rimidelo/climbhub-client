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
  