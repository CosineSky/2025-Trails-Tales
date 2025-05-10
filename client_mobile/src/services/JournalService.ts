import axios from 'axios';

const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;

export const createJournals  = async (data: any) => {
    try{
        const response = await axios.post(`${API_URL}/journals`, data);
        return response.data;
    }catch(error){
        throw error;
    }
}
