import apiClientService from "./apiClientService.ts";
import {_HOST_IP, _HOST_PORT} from "../config.ts";


const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


export const loginUser = async (username: string, password: string) => {
    try {
        const response = await apiClientService.post(`${API_URL}/login`,
            { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const registerUser = async (username: string, password: string) => {
    try {
        const role: number = 0;
        const response = await apiClientService.post(`${API_URL}/register`,
            { username, password, role });
        return response.data;
    } catch (error) {
        throw error;
    }
};
