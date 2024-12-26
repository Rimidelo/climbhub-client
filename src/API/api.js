import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';

// Function to handle user login
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// Function to handle user registration
export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

// Function to get gyms from the server
export const getGyms = async () => {
    try {
        const response = await axios.get(`${API_URL}/gyms`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching gyms:', error);
        throw error;
    }
};

// Function to create a new profile
export const createProfile = async (profileData) => {
    try {
        const response = await axios.post(`${API_URL}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
};