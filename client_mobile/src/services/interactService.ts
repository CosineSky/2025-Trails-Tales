import apiClientService from "./apiClientService.ts";
import {_HOST_IP, _HOST_PORT} from "../config.ts";


const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


/**
 * A user 'likes' a specific journal.
 * @param journal_id id of the target journal
 * @param user_id user's id
 */
export const likeJournal = async (journal_id: number, user_id: number) => {
    console.log(`${API_URL}/like`);
    const res = await apiClientService.post(`${API_URL}/like`, { journal_id, user_id });
    return res.data;
};


/**
 * A user cancels a 'like' to a specific journal.
 * @param journal_id id of the target journal
 * @param user_id user's id
 */
export const unlikeJournal = async (journal_id: number, user_id: number) => {
    const res = await apiClientService.delete(`${API_URL}/like`, { data: { journal_id, user_id } });
    return res.data;
};


/**
 * Getting the total number of 'likes' for the target journal.
 * @param journal_id id of the target journal
 */
export const getLikeCount = async (journal_id: number) => {
    const res = await apiClientService.get(`${API_URL}/like/count/${journal_id}`);
    return res.data;
};


/**
 * Judge if a user has already 'liked' the target journal.
 * @param journal_id id of the target journal
 * @param user_id user's id
 */
export const getLikeStatus = async (journal_id: number, user_id: number) => {
    const res = await apiClientService.get(`${API_URL}/like/status`, {
        params: { journal_id, user_id }
    });
    return res.data;
};


/**
 * A user follows another user. (A follows B)
 * @param follower_id A above
 * @param followee_id B above
 */
export const followUser = async (follower_id: number, followee_id: number) => {
    const res = await apiClientService.post(`${API_URL}/follow`, { follower_id, followee_id });
    return res.data;
};


/**
 * A user unfollows another user. (A unfollows B)
 * @param follower_id A above
 * @param followee_id B above
 */
export const unfollowUser = async (follower_id: number, followee_id: number) => {
    const res = await apiClientService.delete(`${API_URL}/follow`, { data: { follower_id, followee_id } });
    return res.data;
};


/**
 * Getting how many other users the target user has followed, and how many followers he/she have.
 * @param user_id user's id
 */
export const getFollowStats = async (user_id: number) => {
    const res = await apiClientService.get(`${API_URL}/follow/stats/${user_id}`);
    return res.data;
};


/**
 * A user posts a comment under a specific journal.
 * @param journal_id id of the target journal
 * @param user_id id of the commenter
 * @param comment content of the comment
 */
export const postComment = async (journal_id: number, user_id: number, comment: string) => {
    const res = await apiClientService.post(`${API_URL}/comment`, { journal_id, user_id, comment });
    return res.data;
};


/**
 * Getting all comments under a specific journal.
 * @param journal_id id of the target journal
 */
export const getComments = async (journal_id: number) => {
    const res = await apiClientService.get(`${API_URL}/comment/${journal_id}`);
    return res.data;
};
