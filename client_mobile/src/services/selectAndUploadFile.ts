import {launchImageLibrary} from "react-native-image-picker";


const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


export const handleImagePick = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        launchImageLibrary({mediaType: 'photo'}, async (response) => {
            try {
                if (response.didCancel || !response.assets) {
                    resolve(null);
                    return;
                }

                const asset = response.assets[0];
                const uri = asset.uri;
                const fileName = asset.fileName || 'image.jpg';
                const type = asset.type || 'image/jpeg';

                const formData = new FormData();
                formData.append('avatar', {
                    uri,
                    name: fileName,
                    type,
                } as any); // React Native 的 FormData 类型可能需要断言

                const res = await fetch(`${API_URL}/utils/oss`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const data = await res.json();
                console.log('上传成功：', data.url);
                resolve(data.url);
            } catch (err) {
                console.error('上传失败', err);
                reject(err);
            }
        });
    });
};