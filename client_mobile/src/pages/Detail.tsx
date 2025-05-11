import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    AppState,
    Dimensions,
    Share,
    TextInput, ImageBackground
} from 'react-native';
import {Video, VideoRef} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.ts';
import Svg, {Circle, Line, Path} from "react-native-svg";
import {getLikeCount, getLikeStatus, likeJournal, unlikeJournal} from "../services/interactService.ts";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

type JournalDetailRouteProp = RouteProp<RootStackParamList, 'JournalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'JournalDetail'>;
const backgroundImage = require('../assets/images/bg/home.jpg');

const HOST_IP = "115.175.40.241"; // This gives 127.0.0.1 in host device.
const HOST_PORT = "5000";
const API_URL = `http://${HOST_IP}:${HOST_PORT}/api`;


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
};


export default function Detail() {
    const videoRef = useRef<VideoRef>(null);

    const [journal, setJournal] = useState<Journal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [appState, setAppState] = useState(AppState.currentState);
    const [showMiniPlayer, setShowMiniPlayer] = useState(false);
    const [comment, setComment] = useState(""); // 评论输入框的内容
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const route = useRoute<JournalDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const [currentUserId, setCurrentUserId] = useState(-1);
    const { id } = route.params;


    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setShowMiniPlayer(scrollY > 200); // 简单判断，实际需更精确
    };


    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token') as string;
            const decoded: any = jwtDecode(token); // { userId, username, role }
            setCurrentUserId(decoded.userId);
        }
        fetchToken().then(async () => {
            // @ts-ignore
            const likeStatus = await getLikeStatus(journal.id, currentUserId);
            setIsLiked(likeStatus.liked);
        });
    }, []);


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
                });
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJournal().then(r => {});
    }, [id]);


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


    const handleShare = async () => {
        if (!journal) return;

        try {
            const result = await Share.share({
                message: `我发现了一篇很棒的游记《${journal.title}》，快来看看吧：https://your-website.com/journal/${journal.id}`,
            });
            if (result.action === Share.sharedAction) {
                console.log('分享成功');
            }
        } catch (error) {
            console.error('分享失败:', error);
        }
    };


    const handleLike = async () => {
        try {
            // @ts-ignore
            const journalId = journal.id;
            await likeJournal(journalId, currentUserId); // journal_id, user_id
            const likeCountResult = await getLikeCount(journalId);
            setLikeCount(likeCountResult.count);
            setIsLiked(true);
        } catch (err) {
            console.error('点赞失败', err);
        }
    }


    const handleUnlike = async () => {
        try {
            // @ts-ignore
            const journalId = journal.id;
            await unlikeJournal(journalId, currentUserId); // journal_id, user_id
            const likeCountResult = await getLikeCount(journalId);
            setLikeCount(likeCountResult.count);
            setIsLiked(false);
        } catch (err) {
            console.error('点赞失败', err);
        }
    }


    const handleFollow = async () => {

    }


    const handleCommentSubmit = () => {
        if (comment.trim()) {
            // 提交评论的逻辑（如：调用 API 或更新本地状态）
            console.log('评论提交：', comment);
            setComment(""); // 清空输入框
        }
    };


    if (loading || !journal) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }



    return (
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <ScrollView onScroll={handleScroll} style={styles.container}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true} style={styles.mediaScroll}>
                    {journal.video_url ? (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setIsFullscreen(true);
                                videoRef.current?.presentFullscreenPlayer(); // 进入视频全屏模式
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
                    {journal.pictures.map((url, idx) => (
                        <Image key={idx} source={{ uri: url }} style={styles.mediaItem} />
                    ))}
                </ScrollView>

                <Text style={styles.title}>{journal.title}</Text>
                <View style={styles.authorRow}>
                    <Image source={{ uri: journal.owner_avatar_url }} style={styles.avatar} />
                    <Text style={styles.nickname}>{journal.owner_nickname}</Text>
                </View>
                <View style={styles.separator} />
                <Text style={styles.content}>{journal.content}</Text>
                <Text style={styles.datetime}>{'发布时间：' + journal.created_at.substring(0, 10)}</Text>
            </ScrollView>

            <View style={styles.bottomBar}>
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
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="写评论..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleCommentSubmit}>
                        <Text style={styles.sendButtonText}>发送</Text>
                    </TouchableOpacity>
                </View>
            </View>

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
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
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
    content: {
        fontSize: 16,
        lineHeight: 22,
    },
    datetime: {
        fontSize: 18,
        lineHeight: 22,
        color: '#4e4e4e',
        marginTop: 12,
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
    },
});
