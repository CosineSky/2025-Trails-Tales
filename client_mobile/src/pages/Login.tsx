import React, { useState } from 'react';
import { View, StyleSheet, Alert, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Circle, Path, Rect} from "react-native-svg";


const logoImage = require('../assets/images/logo.png');
const backgroundImage = require('../assets/images/login.jpg');


const Login: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password); // expects { token }
            const token = response.token;
            const decoded: any = jwtDecode(token); // { userId, username, role }

            // saving token to async storage.
            await AsyncStorage.setItem('token', token);
            dispatch(login({ ...decoded, token }));
            navigation.replace('Main');
        } catch (error) {
            console.log(error);
            Alert.alert('登录失败', '错误的用户名或密码！');
        }
    };

    const handleGuestLogin = () => {
        navigation.replace('Main', { isGuest: true });
    };

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Image
                    source={logoImage}
                    alt="Logo"
                    style={styles.logo}
                />
                <View style={styles.inputWrapper}>
                    <Svg style={{marginRight: 5, marginBottom: 10}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <Circle cx="12" cy="7" r="4"/>
                    </Svg>
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="请输入邮箱..."
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Svg style={{marginRight: 5, marginBottom: 10}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <Rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                        <Path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </Svg>
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        placeholder="请输入密码..."
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="登录"
                            onPress={handleLogin}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="注册"
                            onPress={() => navigation.navigate('Register')}
                            backgroundColor="#6c757d"
                        />
                    </View>
                </View>
                <View style={styles.guestContainer}>
                    <Text style={styles.guestText}>暂时不想注册？试试</Text>
                    <TouchableOpacity onPress={handleGuestLogin}>
                        <Text style={styles.guestLink}>游客模式</Text>
                    </TouchableOpacity>
                    <Text style={styles.guestText}>！</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.66)',
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    buttonWrapper: {
        flex: 1,
    },
    guestContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'center',
    },
    guestText: {
        fontSize: 14,
        color: '#000',
    },
    guestLink: {
        fontSize: 14,
        color: '#339dac',
        marginLeft: 5,
    },
});

export default Login;
