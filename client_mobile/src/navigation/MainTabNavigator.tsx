// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/main/Home';
import Story from "../pages/main/Story.tsx";
import Profile from '../pages/main/Profile';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Story" component={Story} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
