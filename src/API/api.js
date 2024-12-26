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
// New: Video Upload using fetch
// -------------------
export const uploadVideo = async (formData) => {
    // We use fetch here instead of axios
    try {
        const response = await fetch(`${API_URL}/video`, {
            method: 'POST',
            body: formData, // formData includes the file + other fields
        });

        // Parse the JSON response
        const data = await response.json();

        // If the response is not OK (e.g., status 400 or 500), throw an error
        if (!response.ok) {
            throw new Error(data.error || 'Error uploading video');
        }

        return data; // Return the successful upload response
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};
