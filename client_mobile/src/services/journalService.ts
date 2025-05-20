import apiClientService from "./apiClientService.ts"
import {_HOST_IP, _HOST_PORT} from "../config.ts";


const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


type Journal = {
    title : string;
    content : string;
    cover_url : string;
    video_url : string;
    pictures: Array<string>;
}


export const createJournal  = async (journal: Journal) => {
    try {
        const response = await apiClientService.post(
            `${API_URL}/journals/upload`, journal);
        return response.data;
    } catch (error) {
        throw error;
    }
}
