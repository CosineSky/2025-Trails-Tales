import React, {useEffect} from "react";
import {useState} from "react";
import {Alert, Image, ScrollView, StyleSheet, Text, View} from "react-native";
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Asset} from "react-native-image-picker";
import {handleFilePick, uploadSingleFile} from "../../services/selectAndUploadFile.ts";
import {createJournal} from "../../services/journalService.ts";
import {useSelector} from "react-redux";

type Journal = {
    title : string;
    content : string;
    cover_url : string;
    video_url : string;
    pictures: Array<string>;
}

export default function publishJournal({navigation} : any){
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [pictures, setPictures] = useState<Asset[]>([])
    const [video, setVideo] = useState<Asset>()
    //从token中解析出user信息
    const user = useSelector((state: any) => state.auth.user);

    // 检查是否已登录
    useEffect(() => {
        if (!user) {
            Alert.alert('请先登录', '您尚未登录，请先登录以继续操作', [
                { text: '确定', onPress: () => navigation.replace('Login') }
            ]);
        }
    }, [user, navigation]);

    const handleSelectImages = async() =>{
        const selectedImages = await handleFilePick('photo',10);
        if (selectedImages) {
            setPictures(selectedImages);
        }
    }

    const handleSelectVideo = async() =>{
        const selectedVideo = await handleFilePick( 'video',1);
        if (selectedVideo) {
            setVideo(selectedVideo[0])
        }
    }

    const handlePublish = async() =>{
        //校验必须字段
        if (!title.trim()) {
            Alert.alert('标题不能为空')
        }
        if (!content.trim()) {
            Alert.alert('内容不能为空')
        }
        if (!pictures) {
            Alert.alert('请选择图片')
        }

        //把选择的图片和视频上传到OSS
        const pic_urls = await Promise.all(pictures.map(async (pic : Asset) => uploadSingleFile(pic) ))
        const video_url = video ? await uploadSingleFile(video) : ''        //可能没有上传视频

        //创建Journal对象，向后端请求添加游记
        const new_journal: Journal = {
            title,
            content,
            cover_url : pic_urls[0] || '',
            video_url : video_url || '',
            pictures: pic_urls,
        }

        console.log(`Before creating journal:`);
        console.log(new_journal);
        await createJournal(new_journal)
        console.log(`Created journal.`)
    }

    return(
        <ScrollView>
            <Input value={title} onChangeText={setTitle} placeholder={'游记标题'}/>
            <Input value={content} onChangeText={setContent} placeholder={'游记内容'}/>
            <Button title={'选择图片'} onPress={handleSelectImages} />
            {pictures.map((asset : Asset, index) => (
                <Image
                    key={index}
                    source={{ uri: asset.uri }}
                    style={{ width: 100, height: 100, margin: 5 }}
                />
            ))}
            <Button title={'选择视频'} onPress={handleSelectVideo} />
            {video && (
                <View>
                    <Text>视频：{video.fileName}</Text>
                </View>
            )}
            <Button title={'发布游记'} onPress={handlePublish}/>
        </ScrollView>
    )

}

const styles = StyleSheet.create({

})


