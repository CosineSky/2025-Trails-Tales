import React from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Detail from "../pages/Detail.tsx";
import Post from "../pages/main/Post.tsx";
import Edit from "../pages/Edit.tsx";
import MainTabNavigator from "./MainTabNavigator.tsx";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();


/**
 * Navigator of the entire app.
 * @constructor
 */
const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
            <Stack.Screen name="Login" component={Login} options={{ title: '登录' }} />
            <Stack.Screen name="Register" component={Register} options={{ title: '注册' }} />
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ title: '足迹与故事' }} />
            <Stack.Screen name="Detail" component={Detail} options={{ title: '足迹详情' }} />
            <Stack.Screen name="Post" component={Post} options={{ title: '新的故事' }} />
            <Stack.Screen name="Edit" component={Edit} options={{ title: '编辑个人资料' }} />
        </Stack.Navigator>
    </NavigationContainer>
);


export default AppNavigator;
