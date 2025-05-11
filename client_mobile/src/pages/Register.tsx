import React, { useState } from 'react';
import { View, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';


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
        if (password.length < 6) {
            Alert.alert('注册失败', '密码长度至少为6个字符！');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('注册失败', '密码与确认密码不匹配！');
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
                <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                />
                <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                />
                <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry
                />
                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="Register"
                            onPress={handleRegister}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button
                            title="Login"
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
