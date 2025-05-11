// src/components/Button.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';

interface ButtonProps {
    title: string,
    onPress: () => void,
    backgroundColor?: string,
    style?: ViewStyle
}

const Button: React.FC<ButtonProps> = ({title, onPress, backgroundColor = '#40adba', style}) => (
    <TouchableOpacity style={[styles.button, {backgroundColor}]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#40adba',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Button;
