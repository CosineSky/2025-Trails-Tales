import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { handleFilePick, uploadSingleFile } from '../services/selectAndUploadFile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { fetchProfile, updateProfile } from '../services/profileService';
import { Asset } from 'react-native-image-picker';

interface DecodedToken {
    userId: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}

const EditProfile: React.FC = ({ navigation }: any) => {
    const decodedUserToken = useRef<DecodedToken | null>(null);
    const [avatar, setAvatar] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');

    useEffect(() => {
        const loadUser = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                decodedUserToken.current = jwtDecode<DecodedToken>(token);
                const profile = await fetchProfile(decodedUserToken.current.userId);
                setAvatar(profile.user.avatar);
                setNickname(profile.user.nickname);
            }
        };
        loadUser().then(r => {});
    }, []);

    const handleAvatarUpload = async () => {
        const asset = await handleFilePick('photo');
        if (asset && asset[0]) {
            const uri = await uploadSingleFile(asset[0] as Asset);
            if (uri) {
                setAvatar(uri);
            }
        }
    };

    const handleSave = async () => {
        if (!decodedUserToken.current) return;
        await updateProfile(decodedUserToken.current.userId, nickname, avatar);

        // 更新资料并刷新 Profile 页面
        Alert.alert('成功', '个人资料已更新');

        // 更新 Profile 页面
        navigation.setParams({
            updatedNickname: nickname,
            updatedAvatar: avatar,
        });

        navigation.navigate('Main', { screen: 'Me' }, {
            updatedNickname: nickname,
            updatedAvatar: avatar,
        });

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>编辑个人资料</Text>

            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.changeAvatarButton} onPress={handleAvatarUpload}>
                    <Text style={styles.changeAvatarText}>更换头像</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="请输入新昵称"
                value={nickname}
                onChangeText={setNickname}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>保存修改</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: '#f7f7f7',  // 淡灰色背景
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',  // 深色字体
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,  // 圆形头像
        borderWidth: 3,
        borderColor: '#ddd',  // 头像边框颜色
        marginBottom: 10,
    },
    changeAvatarButton: {
        backgroundColor: '#40adba',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 30,
    },
    changeAvatarText: {
        color: '#fff',
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#40adba',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfile;
