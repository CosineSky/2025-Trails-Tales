import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.ts'; // 👈 自定义路由类型

type JournalDetailRouteProp = RouteProp<RootStackParamList, 'JournalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'JournalDetail'>;

type Journal = {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    author: {
        avatar: string;
        nickname: string;
    };
};

export default function Detail() {
    const route = useRoute<JournalDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { id } = route.params;

    const [journal, setJournal] = useState<Journal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 模拟 API 调用（替换为你的真实接口）
        const fetchJournal = async () => {
            setLoading(true);
            // 你可以在这里使用 fetch(`/api/journals/${id}`) 来替代
            setTimeout(() => {
                setJournal({
                    id,
                    title: '探索丽江古城',
                    content: '这是一次令人难忘的旅程，记录了我在丽江古城的美好时光...',
                    imageUrl: 'https://images.pexels.com/photos/1248418/pexels-photo-1248418.jpeg?auto=compress&cs=tinysrgb&w=800',
                    author: {
                        avatar: 'https://images.pexels.com/photos/1248418/pexels-photo-1248418.jpeg?auto=compress&cs=tinysrgb&w=800',
                        nickname: '旅行者小李',
                    },
                });
                setLoading(false);
            }, 1000);
        };

        fetchJournal().then(() => {});
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>← 返回</Text>
            </TouchableOpacity>

            <Image source={{ uri: journal.imageUrl }} style={styles.image} />

            <Text style={styles.title}>{journal.title}</Text>

            <View style={styles.authorRow}>
                <Image source={{ uri: journal.author.avatar }} style={styles.avatar} />
                <Text style={styles.nickname}>{journal.author.nickname}</Text>
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
});
