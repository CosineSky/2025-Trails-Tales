import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import { jwtDecode } from 'jwt-decode';
import { fetchProfile } from '../../services/profileService.ts';
import Svg, {Circle, Path} from "react-native-svg";

const defaultAvatar = 'http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/1746532505514.jpg';
const profileImage = require('../../assets/images/bg/profile.jpg');


interface DecodedToken {
    userId: number;
    username: string;
    role: number;
    iat: number;
    exp: number;
}


const UserInfo: React.FC = ({ navigation, route }: any) => {
    const decodedUserToken = useRef<DecodedToken | null>(null);
    const [avatar, setAvatar] = useState<string>(defaultAvatar); // 用户头像URL
    const [nickname, setNickname] = useState<string>('Offline'); // 用户昵称
    const [newAvatar, setNewAvatar] = useState<string>(''); // 存储选择的新头像


    useEffect(() => {
        if (route.params) {
            console.log(route.params.updatedNickname);
            setNickname(route.params.updatedNickname);
            setAvatar(route.params.updatedAvatar);
        }
    }, [route.params]);


    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token') as string;
                if(!token){
                    //若用户未登录，提示并跳转到登陆页面
                    console.log("用户未登录")
                    Alert.alert('您还没有登录，请先登录后再查看个人信息')
                    navigation.replace('Login');
                    return
                }
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

    const handleLogout = async () => {
        navigation.navigate("Login")
        await AsyncStorage.removeItem('token');
    }

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

                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.info}>Love. Understanding. Positivity.</Text>


                <View style={styles.statsCard}>
                    <View style={styles.statsItem}>
                        <Text style={styles.statsNumber}>114</Text>
                        <Text style={styles.statsLabel}>粉丝</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statsItem}>
                        <Text style={styles.statsNumber}>514</Text>
                        <Text style={styles.statsLabel}>获赞</Text>
                    </View>
                </View>


                <View style={styles.iconRow}>
                    {/* 编辑个人信息按钮 */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Edit')}
                        style={styles.iconButton}
                    >
                        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                            <Path
                                d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                            <Circle cx="10" cy="7" r="4" />
                        </Svg>
                        <Text style={styles.iconLabel}>编辑</Text>
                    </TouchableOpacity>

                    {/* 清除缓存按钮 */}
                    <TouchableOpacity
                        onPress={() => {
                            FastImage.clearMemoryCache()
                                .then(r => {});
                            FastImage.clearDiskCache()
                                .then(r => {});
                            Alert.alert('成功！', '已成功清除缓存！');
                        }}
                        style={styles.iconButton}
                    >
                        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path
                                d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
                            <Path d="M22 21H7"/>
                            <Path d="m5 11 9 9"/>
                        </Svg>
                        <Text style={styles.iconLabel}>清除缓存</Text>
                    </TouchableOpacity>

                    {/* To Login 按钮 */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.iconButton}
                    >
                        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <Path d="M10 17l5-5-5-5" />
                            <Path d="M15 12H3" />
                        </Svg>
                        <Text style={styles.iconLabel}>退出</Text>
                    </TouchableOpacity>
                </View>


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
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        zIndex: 1,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#000000',
    },
    block: {
        marginTop: 100,
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginVertical: 20,
        width: '80%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statsItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#ccc',
    },
    statsNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statsLabel: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginTop: 0,
    },
    iconButton: {
        alignItems: 'center',
    },

    iconLabel: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },

});

export default UserInfo;
