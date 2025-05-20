import apiClientService from "./apiClientService.ts";
import {_HOST_IP, _HOST_PORT} from "../config.ts";

const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


/**
 * Update a user's profile.
 * @param id id of the target user
 * @param nickname user's new nickname
 * @param avatar user's new avatar's image url
 */
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


/**
 * Getting the profile info of a specific user.
 * @param id id of the target user
 */
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
