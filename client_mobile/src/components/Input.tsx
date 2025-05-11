import React from 'react';
import { TextInput, StyleSheet } from 'react-native';


interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
}


const Input: React.FC<InputProps> = ({ value, onChangeText, placeholder, secureTextEntry }) => (
    <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
    />
);


const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
});


export default Input;
