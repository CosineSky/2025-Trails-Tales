// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';

const Login: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const user = await loginUser(email, password);
            dispatch(login(user));
            navigation.replace('Main');
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid credentials or server error.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Input value={email} onChangeText={setEmail} placeholder="Email" />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default Login;
