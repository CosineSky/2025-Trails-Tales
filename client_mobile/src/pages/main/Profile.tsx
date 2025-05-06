import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // 用于选择图片


const testAvatar = require('../../assets/images/avatar.png');


const UserInfo: React.FC = () => {
    const [avatar, setAvatar] = useState<string>(''); // 用户头像URL
    const [nickname, setNickname] = useState<string>(''); // 用户昵称

    // 这里模拟从本地存储或 API 获取用户信息
    useEffect(() => {
        // 假设从后端或本地获取用户信息
        setAvatar('https://oss-yourbucket.oss-cn-region.aliyuncs.com/user-avatar.jpg'); // 从阿里云 OSS 获取头像
        setNickname('John Doe');
    }, []);

    const handleImagePick = () => {
        launchImageLibrary({mediaType: 'photo'}, response => {
            // 先检查 response.assets 是否存在
            if (!response.assets || response.assets.length === 0) {
                // 如果没有选择图片或响应没有assets，返回
                Alert.alert('未选择图片');
                return;
            }

            // 访问 assets 并上传头像
            const uri = response.assets[0].uri as string;
            uploadAvatar(uri);
        }).then(() => {});
    };


    const uploadAvatar = (uri: string) => {
        // 假设你已经有阿里云 OSS SDK 配置好了并可以上传图片
        // 使用阿里云 OSS SDK 上传图片并获取 URL
        const avatarUrl = 'https://oss-yourbucket.oss-cn-region.aliyuncs.com/uploaded-avatar.jpg'; // 返回的头像URL
        setAvatar(avatarUrl); // 更新头像
        Alert.alert('头像更新成功');
    };

    const handleNicknameChange = () => {
        // 这里你可以调用 API 来更新用户的昵称
        Alert.alert('昵称已更新');
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Button title="更改头像" onPress={handleImagePick} />
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="修改昵称"
            />
            <Button title="保存" onPress={handleNicknameChange} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20,
    },
});

export default UserInfo;
