import axios from 'axios';
import apiClient from "./apiClient.ts";


const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


/*
    Like.
 */
export const likeJournal = async (journal_id: number, user_id: number) => {
    console.log(`${API_URL}/like`);
    const res = await apiClient.post(`${API_URL}/like`, { journal_id, user_id });
    return res.data;
};


/*
    Dislike.
 */
export const unlikeJournal = async (journal_id: number, user_id: number) => {
    const res = await apiClient.delete(`${API_URL}/like`, { data: { journal_id, user_id } });
    return res.data;
};


/*
    Getting the amount of likes of a journal.
 */
export const getLikeCount = async (journal_id: number) => {
    const res = await apiClient.get(`${API_URL}/like/count/${journal_id}`);
    return res.data;
};


/*
    Decide if a user liked a specific journal.
 */
export const getLikeStatus = async (journal_id: number, user_id: number) => {
    const res = await apiClient.get(`${API_URL}/like/status`, {
        params: { journal_id, user_id }
    });
    return res.data;
};


/*
    Follow.
 */
export const followUser = async (follower_id: number, followee_id: number) => {
    const res = await apiClient.post(`${API_URL}/follow`, { follower_id, followee_id });
    return res.data;
};


/*
    Unfollow.
 */
export const unfollowUser = async (follower_id: number, followee_id: number) => {
    const res = await apiClient.delete(`${API_URL}/follow`, { data: { follower_id, followee_id } });
    return res.data;
};


/*
    Getting the amount of followers & followees.
 */
export const getFollowStats = async (user_id: number) => {
    const res = await apiClient.get(`${API_URL}/follow/stats/${user_id}`);
    return res.data;
};


/*
    Posting a comment.
 */
export const postComment = async (journal_id: number, user_id: number, comment: string) => {
    const res = await apiClient.post(`${API_URL}/comment`, { journal_id, user_id, comment });
    return res.data;
};


/*
    Retrieving comment list of a journal.
 */
export const getComments = async (journal_id: number) => {
    const res = await apiClient.get(`${API_URL}/comment/${journal_id}`);
    return res.data;
};
