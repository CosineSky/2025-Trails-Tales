import React, {useEffect, useState} from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    ImageBackground,
    Alert,
    Platform,
} from "react-native";
import {useSelector} from "react-redux";
import {RouteProp, useRoute} from "@react-navigation/native";
import { MapView, Marker, MapType, AMapSdk } from 'react-native-amap3d';

// external modules.
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Asset} from "react-native-image-picker";
import {createJournal} from "../../services/journalService.ts";
import {handleFilePick, uploadSingleFile} from "../../services/selectAndUploadFile.ts";

// utils
import axios from "axios";
import {getAddressFromCoords} from "../../services/mapService.ts";
import {_HOST_IP, _HOST_PORT} from "../../config.ts";


type Journal = {
    id?: number;
    title: string;
    content: string;
    cover_url: string;
    video_url: string;
    pictures: Array<string>;
    location: string;
}
type RouteParams = {
    journal?: Journal;
    isEdit: boolean;
};
AMapSdk.init(
    Platform.select({
        android: "50535d6188f43a27bdc68d5732cad8c7",
    })
);


const backgroundImage = require('../../assets/images/bg/home.jpg');
const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


export default function Post({navigation}: any) {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { journal, isEdit } = route.params || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pictures, setPictures] = useState<Asset[]>([]);
    const [video, setVideo] = useState<Asset>();
    const user = useSelector((state: any) => state.auth.user);
    const [location, setLocation] = useState('');
    const [markerPosition, setMarkerPosition] = useState<{
        latitude: number;
        longitude: number
    } | null>(null);


    useEffect(() => {
        if (!user) {
            Alert.alert('请先登录', '您尚未登录，请先登录以继续操作', [
                {text: '确定', onPress: () => navigation.replace('Login')}
            ]);
        }
    }, [user, navigation]);


    useEffect(() => {
        if (isEdit && journal) {
            setTitle(journal.title);
            setContent(journal.content);
            // 注意：这里假设 journal.pictures 是 string[]（已上传的 URL），需转换为 Asset 格式或兼容显示
            const pictureAssets = journal.pictures.map((url) => ({
                uri: url,
            } as Asset));
            setPictures(pictureAssets);

            if (journal.video_url) {
                setVideo({
                    uri: journal.video_url,
                    fileName: '已上传视频',
                } as Asset);
            }
        }
    }, [isEdit, journal]);


    const handleSelectImages = async () => {
        const selectedImages = await handleFilePick('photo', 10);
        if (selectedImages) {
            setPictures(selectedImages);
        }
    }


    const handleSelectVideo = async () => {
        const selectedVideo = await handleFilePick('video', 1);
        if (selectedVideo) {
            setVideo(selectedVideo[0]);
        }
    }


    const handleMapMarkers = async (nativeEvent: {
        latitude: any;
        longitude: any;
    }) => {
        const { latitude, longitude } = nativeEvent;
        setMarkerPosition({ latitude, longitude });
        const locationInfo = await getAddressFromCoords(latitude, longitude);
        if (locationInfo) {
            setLocation(locationInfo.city);
            Alert.alert(
                "确认足迹",
                `城市: ${locationInfo.city}\n地址: ${locationInfo.address}`
            );
        }
    }


    const handlePublish = async () => {
        if (!title.trim()) {
            Alert.alert('请给游记添加标题');
            return;
        }
        if (!content.trim()) {
            Alert.alert('请填写游记内容');
            return;
        }
        if (!pictures.length) {
            Alert.alert('请给游记添加图片');
            return;
        }

        // info of the new journal.
        const pic_urls = await Promise.all(
            pictures.map((pic: Asset) => uploadSingleFile(pic)));
        const video_url = video ? await uploadSingleFile(video) : '';
        const new_journal: Journal = {
            title,
            content,
            cover_url: pic_urls[0] || '',
            video_url: video_url || '',
            pictures: pic_urls,
            location: location,
        };

        // creating a new journal.
        await createJournal(new_journal);

        // deleting the old journal, only in editing mode.
        if (isEdit && journal) {
            axios.put(`${API_URL}/journals/delete/${journal.id}`)
                .then((res) => {
                    console.log('已删除编辑前的游记！');
                })
                .catch((err) => {
                    console.log('删除失败: ' + err);
                });
        }

        // prompt.
        Alert.alert(
            '发布成功',
            '您的游记已成功发布！',
            [{
                text: '确定',
                onPress: () => {
                    navigation.navigate('Main',
                        { screen: 'My Tales' },
                        { refresh: true });
                }
            }]
        );

    }

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>

                {/* map */}
                <Text style={styles.label}>标记足迹</Text>
                <MapView
                    style={{ width: '100%', height: 300 }}
                    mapType={MapType.Satellite}
                    initialCameraPosition={{
                        target: {
                            latitude: 32.050303,
                            longitude: 118.781696,
                        },
                        zoom: 12,
                    }}
                    onLoad={() => getAddressFromCoords(0, 0)}
                    onPress={async ({ nativeEvent }) => handleMapMarkers(nativeEvent)}
                >
                    {markerPosition && (
                        <Marker
                            position={markerPosition}
                            icon={require("../../assets/tiny/footstep.png")}
                            onPress={() => Alert.alert("Marker Pressed")}
                        />
                    )}
                </MapView>;


                {/* title input bar. */}
                <Text style={styles.label}>游记标题</Text>
                <Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder={'为你的故事起个引人注目的标题吧~'}
                />

                {/* main content area. */}
                <Text style={styles.label}>游记内容</Text>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="分享你的足迹~"
                    style={styles.textArea}
                    multiline
                    numberOfLines={256}
                    textAlignVertical="top"
                />

                {/* uploading pictures. */}
                <Button
                    title={'上传图片'}
                    backgroundColor='#999999'
                    onPress={handleSelectImages}
                    style={styles.button}
                />
                <Text style={styles.noteText}>
                    注：你上传的首张图片将作为游记封面；最多上传10张。
                </Text>

                {/* pictures preview. */}
                <View style={styles.imagePreviewContainer}>
                    {pictures.map((asset: Asset, index) => (
                        <Image
                            key={index}
                            source={{uri: asset.uri}}
                            style={styles.image}
                        />
                    ))}
                </View>

                {/* uploading vid btn. */}
                <Button
                    title={'上传视频'}
                    backgroundColor='#999999'
                    onPress={handleSelectVideo}
                    style={styles.button}
                />

                {/* video info. */}
                {video && (
                    <View style={styles.videoInfo}>
                        <Text style={styles.videoText}>视频：{video.fileName}</Text>
                    </View>
                )}

                {/* posting btn. */}
                <Button
                    title={'发布游记'}
                    onPress={handlePublish}
                    style={styles.publishButton}
                />
            </ScrollView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 8,
    },
    textArea: {
        height: 320,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    button: {
        marginVertical: 10,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 6,
    },
    videoInfo: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
    },
    videoText: {
        fontSize: 14,
        color: '#333',
    },
    publishButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    noteText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        marginLeft: 4,
    },
});
