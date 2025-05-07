// src/services/authService.ts
import axios from 'axios';

const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


export const updateProfile = async (id: number, nickname: string, avatar: string) => {
    try {
        const response = await axios.post(`${API_URL}/users/profile/update`,
            { id, nickname, avatar });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchProfile = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/users/profile/fetch`, {
            params: { id }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
