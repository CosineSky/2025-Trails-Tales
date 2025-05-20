// react-native
import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
    AppState,
    Dimensions,
    Share,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Video, VideoRef} from 'react-native-video';
import Svg, {Circle, Line, Path} from "react-native-svg";
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";

// react-navigation
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.ts';

// external modules.
import {getLikeCount, getLikeStatus, likeJournal, unlikeJournal} from "../services/interactService.ts";
import {jwtDecode} from "jwt-decode";
import {_HOST_IP, _HOST_PORT} from "../config.ts";


type JournalDetailRouteProp = RouteProp<RootStackParamList, 'JournalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'JournalDetail'>;
type Journal = {
    id: number;
    title: string;
    content: string;
    cover_url: string;
    video_url?: string | null;
    pictures: string[];
    owner_nickname: string;
    owner_avatar_url: string;
    created_at: string;
    location: string;
};


const backgroundImage = require('../assets/images/bg/home.jpg');
const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;


/*
    Adds fancier styles to journal's main content.
 */
// @ts-ignore
const StyledContent = ({ content }) => {
    if (!content || content.length === 0) {
        return null;
    }
    const firstChar = content.charAt(0);
    const restText = content.slice(1);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <Text style={styles.firstChar}>{firstChar}</Text>
                {restText}
            </Text>
        </View>
    );
};


export default function Detail() {
    /*
        ============================ Refs ============================
     */
    /*
        Video related.
     */
    const videoRef = useRef<VideoRef>(null);
    const [showMiniPlayer, setShowMiniPlayer] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

    /*
        Journal related.
     */
    const [journal, setJournal] = useState<Journal | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comment, setComment] = useState("");

    /*
        Page loading related.
     */
    const route = useRoute<JournalDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const [loading, setLoading] = useState(true);
    const { id } = route.params;

    /*
        Utils
     */
    const [appState, setAppState] = useState(AppState.currentState);
    const [currentUserId, setCurrentUserId] = useState(-1);



    /*
        ============================ Reactive ============================
     */
    /*
        Jwt auth on page loading.
     */
    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token') as string;
            const decoded: any = jwtDecode(token); // { userId, username, role }
            setCurrentUserId(decoded.userId);
        }
        fetchToken().then(r => {});
    }, []);


    /*
        Getting device info, mostly used for video playing.
     */
    useEffect(() => {
        const netUnsubscribe = NetInfo.addEventListener(state => {
            if (state.type === 'wifi') {
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        });
        const appStateListener = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
            setAppState(nextAppState);
        });
        return () => {
            netUnsubscribe();
            appStateListener.remove();
        };
    }, []);


    /*
        loading like status of the journal.
     */
    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!journal || currentUserId === -1) {
                return;
            }
            const likeStatus = await getLikeStatus(journal.id, currentUserId);
            setIsLiked(likeStatus.liked);
            const likeCountResult = await getLikeCount(journal.id);
            setLikeCount(likeCountResult.count);
        };
        fetchLikeStatus().then(r => {});
    }, [journal, currentUserId]);


    /*
        fetching detailed information of the journal.
     */
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
                    created_at: data.created_at,
                    location: data.location,
                });
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJournal().then(r => {});
    }, [id]);



    /*
        ============================ Methods ============================
     */
    /*
        scroll event, currently used for video mini-player detection.
     */
    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setShowMiniPlayer(scrollY > 200);
    };


    /*
        sharing the journal.
     */
    const handleShare = async () => {
        if (!journal) {
            return;
        }
        try {
            const result = await Share.share({
                message: `我发现了一篇很棒的游记《${journal.title}》，快来看看吧：https://currently-under-construction.com/journal/${journal.id}`,
            });
            if (result.action === Share.sharedAction) {
                console.log('分享成功');
            }
        } catch (error) {
            console.error('分享失败:', error);
        }
    };


    /*
        giving or removing a like to the journal
     */
    const handleLike = async () => {
        try {
            // @ts-ignore
            const journalId = journal.id;
            await likeJournal(journalId, currentUserId);
            const likeCountResult = await getLikeCount(journalId);
            setLikeCount(likeCountResult.count);
            setIsLiked(true);
        } catch (err) {
            console.error('Failed to perform \'like\'. ', err);
        }
    }
    const handleUnlike = async () => {
        try {
            // @ts-ignore
            const journalId = journal.id;
            await unlikeJournal(journalId, currentUserId);
            const likeCountResult = await getLikeCount(journalId);
            setLikeCount(likeCountResult.count);
            setIsLiked(false);
        } catch (err) {
            console.error('Failed to perform \'dislike\'. ', err);
        }
    }

    /*
        following the author & commiting a comment.
     */
    const handleFollow = async () => {
        // TODO - Follow a user.
    }
    const handleCommentSubmit = () => {
        // TODO - Post a comment under a journal.
        if (comment.trim()) {
            console.log('评论提交：', comment);
            setComment("");
        }
    };


    /*
        Placeholder when the journal is still loading.
     */
    if (loading || !journal) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }


    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView
                onScroll={handleScroll}
                style={styles.container}
            >
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    style={styles.mediaScroll}
                >
                    {/* 1. video, if existed. */}
                    {journal.video_url ? (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setIsFullscreen(true);
                                videoRef.current?.presentFullscreenPlayer(); // Fullscreen vid.
                            }}
                        >
                            <Video
                                ref={videoRef}
                                source={{ uri: journal.video_url }}
                                style={styles.mediaItem} // 全屏时由系统控制，不用手动改 style
                                resizeMode="cover"
                                paused={!isPlaying}
                                onProgress={(e) => setVideoProgress(e.currentTime)}
                                onFullscreenPlayerDidDismiss={() => {
                                    setIsFullscreen(false);
                                    Orientation.lockToPortrait(); // 恢复竖屏
                                }}
                                onFullscreenPlayerDidPresent={() => {
                                    Orientation.lockToLandscape(); // 全屏后强制横屏
                                }}
                                onLoad={() => setIsPlaying(true)}
                                controls
                            />
                        </TouchableOpacity>
                    ) : null}

                    {/* 2. other pictures. */}
                    {journal.pictures.map((url, idx) => (
                        <FastImage key={idx} source={{ uri: url }} style={styles.mediaItem} />
                    ))}
                </ScrollView>


                {/* journal's title */}
                <Text style={styles.title}>
                    {journal.title}
                </Text>

                {/* author's info, and follow btn. */}
                <View style={styles.authorRow}>
                    <Image
                        source={{uri: journal.owner_avatar_url}}
                        style={styles.avatar}
                    />
                    <Text style={styles.nickname}>
                        {journal.owner_nickname}
                    </Text>
                    <TouchableOpacity onPress={handleFollow} style={styles.icon}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <Path d="M2 21a8 8 0 0 1 13.292-6"/>
                            <Circle cx="10" cy="8" r="5"/>
                            <Path d="M19 16v6"/>
                            <Path d="M22 19h-6"/>
                        </Svg>
                    </TouchableOpacity>
                </View>

                {/* location info card */}
                <View style={styles.locationCard}>
                    <Text style={styles.locationLabel}>📍 足迹地点</Text>
                    <Text style={styles.locationText}>{journal.location || '作者很神秘，没有给出地点哦~'}</Text>
                </View>

                {/* separator */}
                <View style={styles.separator}/>

                {/* main content. */}
                <StyledContent content={journal.content} />

                {/* other info. */}
                <Text style={styles.datetime}>
                    {'发布时间：' + journal.created_at.substring(0, 10)}
                </Text>

            </ScrollView>

            {/* bottom bar, including likes, comments etc; fixed. */}
            <View style={styles.bottomBar}>

                {/* like, switching btn's color depends on liked or not. */}
                <View style={styles.iconWrapper}>
                {isLiked ? (
                        <TouchableOpacity style={styles.iconContainer} onPress={handleUnlike}>
                            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                             2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
                             3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4
                             6.86-8.55 11.54L12 21.35z" fill="#ff415d" />
                            </Svg>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
                            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                             2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
                             3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4
                             6.86-8.55 11.54L12 21.35z" fill="#40adba" />
                            </Svg>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.likeCountText}>{likeCount}</Text>
                </View>

                {/* share btn. */}
                <TouchableOpacity style={styles.iconContainer} onPress={handleShare}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="#40adba"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <Circle cx="18" cy="5" r="3" stroke="#40adba" fill="#40adba"/>
                        <Circle cx="6" cy="12" r="3" stroke="#40adba" fill="#40adba"/>
                        <Circle cx="18" cy="19" r="3" stroke="#40adba" fill="#40adba"/>
                        <Line x1="8.59" x2="15.42" y1="13.51" y2="17.49" stroke="#40adba"/>
                        <Line x1="15.41" x2="8.59" y1="6.51" y2="10.49" stroke="#40adba"/>
                    </Svg>
                </TouchableOpacity>

                {/* comment. */}
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="留下你的评论..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleCommentSubmit}>
                        <Text style={styles.sendButtonText}>发送</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Mini-player for vid. */}
            {showMiniPlayer && journal.video_url && (
                <View style={styles.miniPlayer}>
                    <Video
                        source={{ uri: journal.video_url }}
                        style={{ width: 160, height: 90 }}
                        resizeMode="cover"
                        paused={!isPlaying}
                        controls
                    />
                </View>
            )}
        </ImageBackground>
    );

}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    backBtn: {
        marginBottom: 12,
    },
    backText: {
        color: '#40adba',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    title: {
        fontSize: 28,
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
    icon: {
        padding: 4,
    },
    text: {
        fontSize: 16,
        fontFamily: 'serif',
        lineHeight: 18,
        color: '#333',
    },
    firstChar: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#40adba',
        lineHeight: 32,
    },
    datetime: {
        fontSize: 18,
        lineHeight: 22,
        color: '#4e4e4e',
        marginTop: 12,
        marginBottom: 100 /* This prevents it from being covered by bottom bar. */
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
        flexShrink: 0,
    },
    mediaItem: {
        width: 360, // 或 Dimensions.get('window').width
        height: 240,
        borderRadius: 12,
        marginRight: 8,
    },
    fullscreenVideo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    miniPlayer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconContainer: {
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 2,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    likeCountText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 10
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        flex: 1,
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    sendButton: {
        marginLeft: 5,
        marginRight: 10,
        backgroundColor: '#40adba',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    separator: {
        height: 1,
        backgroundColor: '#515151',  // 设置分割线颜色
        marginVertical: 10,        // 控制分割线的上下间距
    }
    ,locationCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    locationLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    locationText: {
        fontSize: 14,
        color: '#555',
        alignSelf: 'center',
    },

});
