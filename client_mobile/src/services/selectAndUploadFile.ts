import {Asset, launchImageLibrary, MediaType} from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";


const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;

//需要指定文件类型、最多可以选择的文件个数
export const handleFilePick = (mediaType : MediaType , maxCount : number = 1): Promise<Asset[] | null> => {
    return new Promise((resolve, reject) => {
        //打开系统相册
        launchImageLibrary(
            //指定类型与最大文件个数
            {mediaType: mediaType, selectionLimit: maxCount},
            async (response) => {
            try {
                //用户取消选择文件，或者没选择任何文件
                if (response.didCancel || !response.assets) {
                    resolve(null);
                    return;
                }
                //获取所有文件信息
                const assets = response.assets.slice(0, maxCount);
                console.log('文件选择成功');
                resolve(assets);
            } catch (err) {
                console.error('选择失败', err);
                reject(err);
            }
        });
    });
};

export const uploadSingleFile = async (asset: Asset): Promise<string> => {
    const uri = asset.uri;
    const fileName = asset.fileName || 'image.jpg';     // 如果没有文件名，使用默认值
    const type = asset.type || 'image/jpeg';            //  如果没有类型，使用默认值

    if (uri === undefined){
        throw new Error('文件路径为空');
    }
    //压缩图片
    let compressedUri = uri;
    if (type.startsWith('image/')) {
        try {
            const resizedImage = await ImageResizer.createResizedImage(
                uri,
                800,         // 最大宽度
                800,        // 最大高度
                'JPEG',     // 格式
                70          // 质量百分比（70%）
            );
            compressedUri = resizedImage.uri; // 使用压缩后的 URI
        } catch (error) {
            console.warn('图片压缩失败，将使用原图上传', error);
        }
    }

    const formData = new FormData();
    formData.append('avatar', {
        uri: compressedUri,
        name: fileName,
        type,
    } as any);

    const res = await fetch(`${API_URL}/utils/oss`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const data = await res.json();
    return data.url;
};
