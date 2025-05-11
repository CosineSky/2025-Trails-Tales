// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainTabNavigator from "./MainTabNavigator.tsx";
import Detail from "../pages/Detail.tsx";
import Post from "../pages/main/Post.tsx";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login" component={Login} options={{ title: '登录' }} />
            <Stack.Screen name="Register" component={Register} options={{ title: '注册' }} />
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ title: '足迹与故事' }} />
            <Stack.Screen name="Detail" component={Detail} options={{ title: '足迹详情' }} />
            <Stack.Screen name="Post" component={Post} options={{ title: '新的故事' }} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
