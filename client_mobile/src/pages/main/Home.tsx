import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import MasonryList from 'react-native-masonry-list';


const logoImage = require('../../assets/images/logo.png');
const backgroundImage = require('../../assets/images/home.jpg');


const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


type Journal = {
    id: string;
    title: string;
    content: string;
    cover_url: string;
    owner_nickname: string;
    owner_avatar_url: string;
};

const Home: React.FC = ({ navigation }: any) => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchJournals = useCallback(async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/journals/items?page=${page}&search=${search}`);
            const data = await res.json();
            console.log("In Home Page: ", data);
            setJournals(prev => [...prev, ...(data || [])]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchJournals().then(() => {});
    }, [page, search]);

    const onSearch = () => {
        setJournals([]);
        setPage(1); // 重置分页
    };

    const renderItem = (item: Journal) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { id: item.id })}
            activeOpacity={0.8}
        >
            <View style={styles.footerContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content} numberOfLines={6}>{item.content}</Text>
                <View style={styles.userRow}>
                     <Image source={{ uri: item.owner_avatar_url }} style={styles.avatar} />
                     <Text style={styles.nickname}>{item.owner_nickname.substring(0, 10)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <View style={styles.container}>
                <TextInput
                    placeholder="搜索标题或作者..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={onSearch}
                    style={styles.searchBar}
                />


                <MasonryList
                    images={journals.map(j => ({
                        ...j,
                        uri: j.cover_url,
                        dimensions: { width: 200, height: 200, margin: 5 },
                    }))}
                    style={{ width: 200, height: 200 }}
                    renderIndividualFooter={renderItem}
                    onEndReached={() => setPage(prev => prev + 1)}
                    onEndReachedThreshold={0.75}
                />


                {loading && <ActivityIndicator style={styles.loader} />}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    searchBar: {
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: 'rgba(222, 222, 222, 0.8)'
    },
    image: {
        width: '100%',
        height: 200
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 8,
        paddingLeft: 4,
    },
    content: {
        fontSize: 12,
        paddingLeft: 4,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8
    },
    nickname: {
        fontSize: 14,
        color: '#666'
    },
    loader: {
        marginVertical: 10
    },
    footerContainer: {
        width: 195,              // 确保跟图片一样宽
        paddingHorizontal: 6,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
});

export default Home;
