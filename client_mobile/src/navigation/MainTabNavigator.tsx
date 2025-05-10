// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/main/Home';
import Post from '../pages/main/Post';
import Story from "../pages/main/Story";
import Profile from '../pages/main/Profile';
import HomeIcon from '../assets/icons/HomeIcon';
import StoryIcon from "../assets/icons/StoryIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    //指定选项卡图标
                    switch (route.name) {
                        case 'Trails':
                            return <HomeIcon width={size} height={size} fill={color} />;
                        case 'My Tales':
                            return <StoryIcon width={size} height={size} fill={color} />;
                        case 'Me':
                            return <ProfileIcon width={size} height={size} fill={color} />;
                        default:
                            return null;
                    }
                }
            })}
        >
            <Tab.Screen name="Trails" component={Home} />
            <Tab.Screen name="My Tales" component={Story} />
            <Tab.Screen name="Me" component={Profile} />

        </Tab.Navigator>

    );
}
