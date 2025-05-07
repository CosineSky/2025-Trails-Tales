import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { handleImagePick } from '../../services/selectAndUploadFile.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { fetchProfile, updateProfile } from '../../services/profileService.ts';

const defaultAvatar = 'http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/1746532505514.jpg';
const profileImage = require('../../assets/images/profile.jpg');

interface DecodedToken {
    userId: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}

const UserInfo: React.FC = () => {
    const decodedUserToken = useRef<DecodedToken | null>(null);
    const [avatar, setAvatar] = useState<string>(defaultAvatar); // 用户头像URL
    const [nickname, setNickname] = useState<string>('Offline'); // 用户昵称
    const [isEditing, setIsEditing] = useState<boolean>(false); // 是否正在编辑
    const [newAvatar, setNewAvatar] = useState<string>(''); // 存储选择的新头像

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token') as string;
                decodedUserToken.current = jwtDecode<DecodedToken>(token);
                const userData = await fetchProfile(decodedUserToken.current.userId);
                setNickname(userData.user.nickname);
                setAvatar(userData.user.avatar);
            } catch (e) {
                console.error('Failed to load user profile', e);
            }
        };

        loadUser();
    }, []);

    // 处理昵称和头像的更新
    const handleSaveChanges = async () => {
        if (!decodedUserToken.current) {
            console.warn('用户信息未加载');
            return;
        }

        const updatedAvatar = newAvatar || avatar;
        console.log('1 =>', decodedUserToken.current.userId, nickname, updatedAvatar);
        await updateProfile(decodedUserToken.current.userId, nickname, updatedAvatar);
        console.log('2 =>', decodedUserToken.current.userId, nickname, updatedAvatar);
        Alert.alert('信息已保存', `头像: ${updatedAvatar}\n昵称: ${nickname}`);
        handleEditToggle();
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleAvatarChange = (uri: string) => {
        setNewAvatar(uri);
    };

    return (
        <View style={styles.container}>
            {/* 上半部分背景图片 */}
            <View style={styles.topSection}>
                <Image
                    source={profileImage}
                    style={styles.backgroundImage}
                />
            </View>

            {/* 水平分割线 */}
            <View style={styles.separator} />

            {/* 中部，头像 */}
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: newAvatar || avatar }}
                    style={styles.avatar}
                />
            </View>

            {/* 下半部分白色背景 */}
            <View style={styles.bottomSection}>

                {/* 用户昵称显示或编辑 */}
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder="修改昵称"
                        editable={isEditing} // 仅在编辑模式下允许编辑
                    />
                ) : (
                    <Text style={styles.nickname}>{nickname}</Text> // 显示文本
                )}

                {isEditing && (
                    <Button
                        title="上传头像"
                        onPress={async () => {
                            const uri = await handleImagePick();
                            if (uri) {
                                handleAvatarChange(uri); // 更新头像状态
                            }
                        }}
                    />
                )}

                {isEditing ? (
                    <Button title="保存信息" onPress={handleSaveChanges} />
                ) : (
                    <Button title="编辑个人信息" onPress={handleEditToggle} />
                )}

                <Text style={styles.info}>其他用户信息...</Text>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        width: '100%',
    },
    bottomSection: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20,
        marginTop: 50,
    },
    nickname: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
    },
    info: {
        fontSize: 16,
        color: '#888',
    },
    avatarContainer: {
        position: 'absolute',
        top: '50%',  // 使头像垂直居中
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],  // 将头像中心定位到分割线中央
        zIndex: 1,  // 确保头像在分割线之上
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    block: {
        marginTop: 100,
    },
});

export default UserInfo;
