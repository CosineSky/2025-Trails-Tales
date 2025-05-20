import axios from 'axios';
import apiClientService from "./apiClientService.ts";
import {_HOST_IP, _HOST_PORT} from "../config.ts";

const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


export const updateProfile = async (id: number, nickname: string, avatar: string) => {
    try {
        const response = await apiClientService.post(
            `${API_URL}/users/profile/update`,
            { id, nickname, avatar });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchProfile = async (id: number) => {
    try {
        const response = await apiClientService.get(
            `${API_URL}/users/profile/fetch`, {
            params: { id }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
