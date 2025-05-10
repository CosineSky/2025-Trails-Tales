import React from "react";
import {useState} from "react";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Asset} from "react-native-image-picker";
import {handleFilePick, uploadSingleFile} from "../../services/selectAndUploadFile.ts";
import {createJournals} from "../../services/JournalService.ts";
import {createPicture} from "../../services/PictureService.ts";

type Journal = {
    title : string;
    content : string;
    cover_url : string;
    video_url : string;
}

type Picture = {
    journal_id : number;
    resource_url : string;
}

function Icon(props: { name: string, size: number, color: string }) {
    return null;
}

export default function publishJournal(){
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [pictures,setPictures] = useState<Asset[]>([])
    const [video,setVideo] = useState<Asset>()

    const handleSelectImages = async() =>{
        const selectedImages = await handleFilePick('photo',10);
        if(selectedImages){
            setPictures(selectedImages);
        }
    }

    const handleSelectVideo = async() =>{
        const selectedVideo = await handleFilePick( 'video',1);
        if(selectedVideo){
            setVideo(selectedVideo[0])
        }
    }

    const handlePublish = async() =>{
        //校验必须字段
        if(!title.trim()){
            alert('标题不能为空')
        }
        if(!content.trim()){
            alert('内容不能为空')
        }
        if(!pictures){
            alert('请选择图片')
        }

        //把选择的图片和视频上传到OSS
        const pic_urls = await Promise.all(pictures.map(async (pic : Asset) => uploadSingleFile(pic) ))
        const video_url = video ? await uploadSingleFile(video) : ''        //可能没有上传视频

        //创建Journal对象，向后端请求添加游记
        const new_journal : Journal = {
            title,
            content,
            cover_url : pic_urls[0] || '',
            video_url : video_url || ''
        }
        const journal_id : number = await createJournals(new_journal)

        //创建picture对象，绑定刚才创建的Journal，并且存储到数据库中
        const pictures_to_save : Picture[] = pic_urls.map((url : string) => ({
            journal_id,
            resource_url : url
        }))

        pictures_to_save.map((picture : Picture) => createPicture(picture))
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

function alert(arg: string) {
    throw new Error(arg);
}

const styles = StyleSheet.create({

})


