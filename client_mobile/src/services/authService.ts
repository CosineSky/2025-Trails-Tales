// src/services/authService.ts
import axios from 'axios';

const API_URL = 'https://your-api-url.com';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};
