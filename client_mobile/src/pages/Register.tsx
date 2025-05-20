import React, { useState } from 'react';
import { View, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';
import Svg, {Circle, Path, Rect} from "react-native-svg";


const logoImage = require('../assets/images/logo.png');
const backgroundImage = require('../assets/images/login.jpg');


const Register: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('注册失败', '请填充所有字段！');
            return;
        }
        if (password.length < 6 || password.length > 32) {
            Alert.alert('注册失败', '密码长度必须在6到32字符之间！');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('注册失败', '密码与确认密码不匹配！');
            return;
        }
        if (email.length > 16) {
            Alert.alert('注册失败', '用户名长度不能超过16个字符！');
            return;
        }
        try {
            const user = await registerUser(email, password);
            dispatch(login(user));
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('注册失败', '用户名已经存在或服务器错误！');
        }
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
                <View style={styles.inputWrapper}>
                    <Svg style={{marginRight: 5, marginBottom: 10}} width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <Path
                            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                        <Path d="m9 12 2 2 4-4"/>
                    </Svg>
                    <Input
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="请输入确认密码..."
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="注册"
                            onPress={handleRegister}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="登录"
                            onPress={() => navigation.navigate('Login')}
                            backgroundColor="#6c757d"
                        />
                    </View>
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
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    buttonWrapper: {
        flex: 1,
    },
});


export default Register;
