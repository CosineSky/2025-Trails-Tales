import React, {useEffect, useState} from 'react';
import {Alert, Button, Image, StyleSheet, TextInput, View} from 'react-native';
import {handleImagePick} from "../../services/selectAndUploadFile.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; // 用于选择图片

const avatarImage = require('../../assets/images/avatar.png'); // 默认头像图片

const UserInfo: React.FC = () => {
    const [avatar, setAvatar] = useState<string>(''); // 用户头像URL
    const [nickname, setNickname] = useState<string>('John Doe'); // 用户昵称
    const [isEditing, setIsEditing] = useState<boolean>(false); // 是否正在编辑
    const [newAvatar, setNewAvatar] = useState<string>(''); // 存储选择的新头像

    useEffect(() => {
        // 模拟加载用户信息（从后端或本地存储）
        setAvatar('https://oss-yourbucket.oss-cn-region.aliyuncs.com/user-avatar.jpg');
        setNickname('John Doe');
    }, []);

    // 处理昵称和头像的更新
    const handleSaveChanges = () => {
        // 在这里调用后端接口来保存用户修改的头像和昵称
        const updatedAvatar = newAvatar || avatar; // 如果选择了新头像，则使用新头像，否则使用原头像
        // 模拟保存操作
        Alert.alert('信息已保存', `头像: ${updatedAvatar}\n昵称: ${nickname}`);

        // 调用后端API更新用户信息
        // updateUserInfo({ avatar: updatedAvatar, nickname: updatedNickname });

        // 保存完成后退出编辑状态
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // 切换编辑状态
    };

    const handleAvatarChange = (uri: string) => {
        setNewAvatar(uri); // 更新新选择的头像
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: newAvatar || avatar }} style={styles.avatar} />
            {isEditing ? (
                <Button title="上传头像" onPress={() => handleImagePick()} />
            ) : (
                <Button title="更改头像" onPress={() => handleImagePick()} />
            )}
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="修改昵称"
                editable={isEditing} // 仅在编辑模式下允许编辑
            />
            {isEditing ? (
                <Button title="保存信息" onPress={handleSaveChanges} />
            ) : (
                <Button title="编辑个人信息" onPress={handleEditToggle} />
            )}
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
