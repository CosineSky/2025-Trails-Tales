// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/actions/authAction.ts';

const Register: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleRegister = async () => {
        try {
            const user = await registerUser(email, password);
            dispatch(login(user));
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Registration Failed', 'Email already exists or server error.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Input value={email} onChangeText={setEmail} placeholder="Email" />
            <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
            <Button title="Register" onPress={handleRegister} />
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

export default Register;
