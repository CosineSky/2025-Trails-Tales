import React from 'react';
import Home from '../pages/main/Home';
import Story from "../pages/main/Story";
import Profile from '../pages/main/Profile';
import HomeIcon from '../assets/icons/HomeIcon';
import StoryIcon from "../assets/icons/StoryIcon";
import ProfileIcon from "../assets/icons/ProfileIcon";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();


/**
 * Sub-navigator for 'Main' page of Stack.Screen.
 * @constructor
 */
const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
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

export default MainTabNavigator;
