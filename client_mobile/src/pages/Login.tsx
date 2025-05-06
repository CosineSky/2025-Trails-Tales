// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {View, Text, StyleSheet, Alert, ImageBackground, Image} from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

            // 保存 token 到本地和 Redux
            await AsyncStorage.setItem('token', token);
            dispatch(login({ ...decoded, token }));
            navigation.replace('Main');
        } catch (error) {
            console.log(error);
            Alert.alert('Login Failed', 'Invalid credentials or server error.');
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
                <Image source={logoImage} alt="Logo" style={styles.logo} />
                {/*<Text style={styles.title}>Login</Text>*/}
                <Input value={email} onChangeText={setEmail} placeholder="Email" />
                <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
                <View style={styles.buttonRow}>
                    <View style={styles.buttonWrapper}>
                        <Button title="Login" onPress={handleLogin} />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button title="Register" onPress={() => navigation.navigate('Register')} backgroundColor="#6c757d" />
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
    logo: {
        width: 250,
        height: 250,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10, // RN >= 0.71
        marginTop: 10,
    },
    buttonWrapper: {
        flex: 1,
    },

});

export default Login;
