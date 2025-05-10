import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Video } from 'react-native-video';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.ts';

type JournalDetailRouteProp = RouteProp<RootStackParamList, 'JournalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'JournalDetail'>;


const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


type Journal = {
    id: string;
    title: string;
    content: string;
    cover_url: string;
    video_url?: string | null;
    pictures: string[];
    owner_nickname: string;
    owner_avatar_url: string;
};


export default function Detail() {
    const route = useRoute<JournalDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { id } = route.params;

    const [journal, setJournal] = useState<Journal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJournal = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/journals/getById?search=${id}`);
                if (!response.ok) {
                    console.log('Network response was not ok: ', response.json());
                    return;
                }
                const data = await response.json();
                console.log('Fetched journal data:', data);
                setJournal({
                    id: data.id,
                    title: data.title,
                    content: data.content,
                    cover_url: data.cover_url,
                    video_url: data.video_url,
                    pictures: data.pictures || [],
                    owner_nickname: data.owner_nickname,
                    owner_avatar_url: data.owner_avatar_url,
                });
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJournal().then(r => {});
    }, [id]);


    if (loading || !journal) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true} style={styles.mediaScroll}>
                {journal.video_url ? (
                    <Video
                        source={{ uri: journal.video_url }}
                        style={styles.mediaItem}
                        resizeMode="cover"
                    />
                ) : null}
                {journal.pictures.map((url, idx) => (
                    <Image key={idx} source={{ uri: url }} style={styles.mediaItem} />
                ))}
            </ScrollView>

            <Text style={styles.title}>{journal.title}</Text>

            <View style={styles.authorRow}>
                <Image source={{ uri: journal.owner_avatar_url }} style={styles.avatar} />
                <Text style={styles.nickname}>{journal.owner_nickname}</Text>
            </View>

            <Text style={styles.content}>{journal.content}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    backBtn: {
        marginBottom: 12,
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    nickname: {
        fontSize: 16,
        color: '#555',
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaScroll: {
        height: 240,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    mediaItem: {
        width: 360, // 或 Dimensions.get('window').width
        height: 240,
        borderRadius: 12,
        marginRight: 8,
    },
});
