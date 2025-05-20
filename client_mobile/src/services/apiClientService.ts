import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClientService = axios.create({})

apiClientService.interceptors.request.use(
    async(config) => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClientService
