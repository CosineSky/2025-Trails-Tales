import {launchImageLibrary} from "react-native-image-picker";


const HOST_IP = "10.0.2.2"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


export const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, async (response) => {
        if (response.didCancel || !response.assets) return;

        console.log(response.assets);

        const uri = response.assets[0].uri;
        const fileName = response.assets[0].fileName;
        const type = response.assets[0].type;

        const formData = new FormData();
        formData.append('avatar', {
            uri,
            name: fileName,
            type,
        });

        const res = await fetch(`${API_URL}/utils/oss`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = await res.json();
        console.log('上传成功：', data.url);
    }).then(() => {});
};