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
import Svg, { Circle, Path } from "react-native-svg";

const backgroundImage = require('../../assets/images/bg/home.jpg');

const HOST_IP = "115.175.40.241";
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
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchJournals = useCallback(async (isRefresh = false, searchQuery = '') => {
        if (loading && !isRefresh) return;

        isRefresh ? setRefreshing(true) : setLoading(true);

        try {
            const pageToLoad = isRefresh ? 1 : page;
            const res = await fetch(`${API_URL}/journals/items?page=${pageToLoad}&search=${searchQuery}`);
            const data = await res.json();
            console.log("In Home Page: ", data);

            if (isRefresh) {
                setJournals(data);
                setHasMore(data.length > 0);
            } else {
                if (data.length > 0) {
                    setJournals(prev => [...prev, ...data]);
                } else {
                    setHasMore(false);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            isRefresh ? setRefreshing(false) : setLoading(false);
        }
    }, [page, loading]);


    useEffect(() => {
        fetchJournals(true, search).then(r => {});
    }, []);


    useEffect(() => {
        if (page === 1) {
            return;
        }
        console.log(`Calling fetchJournals() from useEffect watching page, page = ${page}`);
        fetchJournals(false, search).then(r => {});
    }, [page]);


    const onSearch = () => {
        setHasMore(true);
        setPage(1);
        console.log(`Calling fetchJournals() from onSearch(), page = ${page}`);
        fetchJournals(true, search).then(r => {});
    };

    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        console.log(`Calling fetchJournals() from handleRefresh(), page = ${page}`);
        fetchJournals(true, search).then(r => {});
    };

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
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
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Svg style={{ marginTop: 18, marginRight: 6 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                        <Path
                            d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                        <Circle cx="10" cy="7" r="4" />
                    </Svg>
                    <TextInput
                        placeholder="搜索标题或作者..."
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={onSearch}
                        style={styles.searchBar}
                    />
                </View>
                <MasonryList
                    images={journals.map(j => ({
                        ...j,
                        uri: j.cover_url,
                        dimensions: { width: 200, height: 200, margin: 5 },
                        key: j.id
                    }))}
                    style={{ width: 200, height: 200 }}
                    renderIndividualFooter={renderItem}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.9}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListFooterComponent={
                        !hasMore && journals.length > 0 ? (
                            <Text style={styles.endText}>已经到底啦~</Text>
                        ) : null
                    }
                />

                {loading && <ActivityIndicator style={styles.loader} />}
                {journals.length === 0 && !loading && (
                    <Text style={styles.noDataText}>暂无数据</Text>
                )}
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
        flex: 1,
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
        width: 195,
        paddingHorizontal: 6,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    endText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 10,
    },
    noDataText: {
        textAlign: 'center',
        color: '#999',
        marginVertical: 20,
        fontSize: 16,
    },
});

export default Home;
