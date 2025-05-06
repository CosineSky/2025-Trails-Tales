// src/services/authService.ts
import axios from 'axios';
import {Alert} from "react-native";

const HOST_IP = "10.0.2.2"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`,
            { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (username: string, password: string) => {
    try {
        const role: number = 0;
        const response = await axios.post(`${API_URL}/register`,
            { username, password, role });
        return response.data;
    } catch (error) {
        throw error;
    }
};
