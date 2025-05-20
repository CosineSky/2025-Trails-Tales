import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import MasonryList from 'react-native-masonry-list';
import Svg, { Circle, Path } from "react-native-svg";
import {_HOST_IP, _HOST_PORT} from "../../config.ts";


type Journal = {
    id: string;
    title: string;
    content: string;
    cover_url: string;
    owner_nickname: string;
    owner_avatar_url: string;
};

const backgroundImage = require('../../assets/images/bg/home.jpg');

const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.45;
const ITEM_HEIGHT = ITEM_WIDTH;


const Home: React.FC = ({ navigation }: any) => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    /*
        core method for fetching journals.
     */
    const fetchJournals = useCallback(
        async (isRefresh = false, searchQuery = '') => {
        if (loading && !isRefresh) {
            return;
        }

        // deciding if it's a refreshing or loading action.
        isRefresh
            ? setRefreshing(true)
            : setLoading(true);

        try {
            // always fetching the first page when it's a refreshing action.
            const pageToLoad = isRefresh ? 1 : page;
            const res = await fetch(
                `${API_URL}/journals/items?page=${pageToLoad}&search=${searchQuery}`);
            const data = await res.json();

            // refreshing => replacing existed journals.
            if (isRefresh) {
                setJournals(data);
                setHasMore(data.length > 0);
            }
            // not refreshing => appending new journals to existed ones
            else {
                if (data.length > 0) {
                    setJournals(prev => [...prev, ...data]);
                } else {
                    setHasMore(false);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            // finishing a fetching action.
            isRefresh
                ? setRefreshing(false)
                : setLoading(false);
        }
    }, [page, loading]);


    /*
        fetching the first page of journals on mounted.
     */
    useEffect(() => {
        fetchJournals(true, search).then(r => {});
    }, []);


    /*
        fetching extra journals on 'page' changed.
     */
    useEffect(() => {
        if (page === 1) {
            return;
        }
        fetchJournals(false, search).then(r => {});
    }, [page]);


    /*
        re-fetching journals from the first page, when search bar changes.
     */
    const onSearch = () => {
        setHasMore(true);
        setPage(1);
        fetchJournals(true, search).then(r => {});
    };


    /*
        re-fetching journals from the first page on refreshing.
     */
    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        fetchJournals(true, search).then(r => {});
    };


    /*
        loading more journals when it reaches the bottom.
     */
    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prev => prev + 1);
        }
    };


    /*
        rendering one journal item.
     */
    const renderItem = (item: Journal) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { id: item.id })}
            activeOpacity={0.8}
        >
            <View style={styles.footerContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content} numberOfLines={4}>{item.content}</Text>
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
                        dimensions: { width: ITEM_WIDTH, height: ITEM_HEIGHT, margin: 5 },
                        key: j.id
                    }))}
                    style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
                    renderIndividualFooter={renderItem}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.9}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}

                    // TODO - fixing the position of bottom-hitting prompt.
                    ListFooterComponent={
                        !hasMore && journals.length > 0 ? (
                            <Text style={styles.endText}>已经到底啦~</Text>
                        ) : null
                    }
                />

                {/* placeholders for loading or empty. */}
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
        width: ITEM_WIDTH,
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
