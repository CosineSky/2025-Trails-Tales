// src/screens/LoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button.tsx';

const Home: React.FC = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
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


export default Home;
