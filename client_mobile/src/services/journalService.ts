import axios from 'axios';

const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


type Journal = {
    title : string;
    content : string;
    cover_url : string;
    video_url : string;
    pictures: Array<string>;
}


export const createJournal  = async (journal: Journal) => {
    try {
        const response = await axios.post(
            `${API_URL}/journals/upload`, journal);
        return response.data;
    } catch (error) {
        throw error;
    }
}
