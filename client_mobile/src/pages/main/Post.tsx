import React, {useEffect} from "react";
import {useState} from "react";
import {
    Alert, Image, ScrollView, StyleSheet, Text, View, TextInput, ImageBackground
} from "react-native";
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Asset} from "react-native-image-picker";
import {handleFilePick, uploadSingleFile} from "../../services/selectAndUploadFile.ts";
import {createJournal} from "../../services/journalService.ts";
import {useSelector} from "react-redux";
import {RouteProp, useRoute} from "@react-navigation/native";
import axios from "axios";


const backgroundImage = require('../../assets/images/bg/home.jpg');

const HOST_IP = "115.175.40.241";
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


type Journal = {
    id?: number;
    title: string;
    content: string;
    cover_url: string;
    video_url: string;
    pictures: Array<string>;
}
type RouteParams = {
    journal?: Journal;  // 现有的游记数据
    isEdit: boolean;    // 是否为编辑模式
};


export default function Post({navigation}: any) {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { journal, isEdit } = route.params || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pictures, setPictures] = useState<Asset[]>([]);
    const [video, setVideo] = useState<Asset>();
    const user = useSelector((state: any) => state.auth.user);

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

    const handlePublish = async () => {
        if (!title.trim()) {
            Alert.alert('标题不能为空');
            return;
        }
        if (!content.trim()) {
            Alert.alert('内容不能为空');
            return;
        }
        if (!pictures.length) {
            Alert.alert('请选择图片');
            return;
        }

        // const pic_urls = await Promise.all(pictures.map((pic: Asset) => uploadSingleFile(pic)));
        // const video_url = video ? await uploadSingleFile(video) : '';
        //
        // const new_journal: Journal = {
        //     title,
        //     content,
        //     cover_url: pic_urls[0] || '',
        //     video_url: video_url || '',
        //     pictures: pic_urls,
        // };
        //
        // console.log('Before creating journal:', new_journal);
        // await createJournal(new_journal);
        // console.log('Created journal.');


        const pic_urls = await Promise.all(pictures.map((pic: Asset) => uploadSingleFile(pic)));
        const video_url = video ? await uploadSingleFile(video) : '';

        const new_journal: Journal = {
            title,
            content,
            cover_url: pic_urls[0] || '',
            video_url: video_url || '',
            pictures: pic_urls,
        };

        // 创建新的游记
        await createJournal(new_journal);

        // 编辑模式下，删除原游记
        if (isEdit && journal) {
            axios.put(`${API_URL}/journals/delete/${journal.id}`)
                .then((response) => {
                    console.log('已删除编辑前的游记！');
                })
                .catch((err) => {
                    console.log('删除失败: ' + err);
                });
        }

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
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <ScrollView contentContainerStyle={styles.container}>
                {/* 标题输入框 */}
                <Text style={styles.label}>游记标题</Text>
                <Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder={'为你的故事起个引人注目的标题吧~'}
                />

                {/* 内容输入框 */}
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

                {/* 图片选择按钮 */}
                <Button
                    title={'上传图片'}
                    backgroundColor='#999999'
                    onPress={handleSelectImages}
                    style={styles.button}
                />
                <Text style={styles.noteText}>注：你上传的首张图片将作为游记封面；最多上传10张。</Text>

                {/* 图片预览 */}
                <View style={styles.imagePreviewContainer}>
                    {pictures.map((asset: Asset, index) => (
                        <Image
                            key={index}
                            source={{uri: asset.uri}}
                            style={styles.image}
                        />
                    ))}
                </View>

                {/* 视频选择按钮 */}
                <Button
                    title={'上传视频'}
                    backgroundColor='#999999'
                    onPress={handleSelectVideo}
                    style={styles.button}
                />

                {/* 视频信息展示 */}
                {video && (
                    <View style={styles.videoInfo}>
                        <Text style={styles.videoText}>视频：{video.fileName}</Text>
                    </View>
                )}

                {/* 发布按钮 */}
                <Button title={'发布游记'} onPress={handlePublish} style={styles.publishButton} />
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
