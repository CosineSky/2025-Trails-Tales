import axios from 'axios';

const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


// 点赞
export const likeJournal = async (journal_id: number, user_id: number) => {
    console.log(`${API_URL}/like`);
    const res = await axios.post(`${API_URL}/like`, { journal_id, user_id });
    return res.data;
};


// 取消点赞
export const unlikeJournal = async (journal_id: number, user_id: number) => {
    const res = await axios.delete(`${API_URL}/like`, { data: { journal_id, user_id } });
    return res.data;
};


// 获取某篇游记的点赞数量
export const getLikeCount = async (journal_id: number) => {
    const res = await axios.get(`${API_URL}/like/count/${journal_id}`);
    return res.data;
};


// 获取点赞状态
export const getLikeStatus = async (journal_id: number, user_id: number) => {

    const res = await axios.get(`${API_URL}/like/status`, {
        params: { journal_id, user_id }
    });
    return res.data;
};


// 关注用户
export const followUser = async (follower_id: number, followee_id: number) => {
    const res = await axios.post(`${API_URL}/follow`, { follower_id, followee_id });
    return res.data;
};


// 取消关注
export const unfollowUser = async (follower_id: number, followee_id: number) => {
    const res = await axios.delete(`${API_URL}/follow`, { data: { follower_id, followee_id } });
    return res.data;
};


// 获取用户的粉丝和关注数
export const getFollowStats = async (user_id: number) => {
    const res = await axios.get(`${API_URL}/follow/stats/${user_id}`);
    return res.data;
};


// 发表评论
export const postComment = async (journal_id: number, user_id: number, comment: string) => {
    const res = await axios.post(`${API_URL}/comment`, { journal_id, user_id, comment });
    return res.data;
};


// 获取某篇游记的评论列表
export const getComments = async (journal_id: number) => {
    const res = await axios.get(`${API_URL}/comment/${journal_id}`);
    return res.data;
};
