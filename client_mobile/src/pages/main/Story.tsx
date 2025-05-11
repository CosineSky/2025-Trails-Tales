import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const API_URL = "http://115.175.40.241:5000/api";


type Journal = {
    id: string;
    title: string;
    content: string;
    cover_url: string;
    status: number;
    detail_status?: string;
};


const MyJournalsScreen: React.FC = ({ navigation }: any) => {
    const [journals, setJournals] = useState<Journal[]>([]);
    let currentUserId: number;


    useEffect(() => {
        const fetchToken = async () => {
            const token = await AsyncStorage.getItem('token') as string;
            const decoded: any = jwtDecode(token); // { userId, username, role }
            currentUserId = decoded.userId;
            console.log("token", decoded.userId);
        }
        const fetchMyJournals = async () => {
            try {
                console.log("Fetch MyJournals: ");
                console.log(`${API_URL}/journals/getByOwnerId?owner_id=${currentUserId}`);
                const res = await fetch(`${API_URL}/journals/getByOwnerId?owner_id=${currentUserId}`);
                const data = await res.json();
                setJournals(data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchToken().then(() => {
            fetchMyJournals().then(r => {});
        });
    }, []);


    const renderStatus = (status: number, reason?: string) => {
        switch (status) {
            case 0: return <Text style={styles.pending}>待审核</Text>;
            case 1: return <Text style={styles.approved}>已通过</Text>;
            case 2: return (
                <View>
                    <Text style={styles.rejected}>未通过</Text>
                    {reason && <Text style={styles.reason}>原因：{reason}</Text>}
                </View>
            );
            default: return null;
        }
    };


    const onEdit = (id: any) => {

    }


    const onDelete = (id: any) => {
        console.log("Hi")
        Alert.alert('确认删除', '确定要删除这篇游记吗？', [
            { text: '取消', style: 'cancel' },
            { text: '删除', style: 'destructive', onPress: async () => {
                    axios.put(`${API_URL}/journals/delete/${id}`)
                        .then((response) => {
                            console.log('删除成功！');
                            const updatedJournals = journals.filter(journal => journal.id !== id);
                            setJournals(updatedJournals);
                        })
                        .catch((err) => {
                            console.log('删除失败: ' + err);
                        });
                }}
        ]);
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.publishButton}
                onPress={() => navigation.navigate('Post')}
            >
                <Text style={styles.publishText}>➕ 发布新游记</Text>
            </TouchableOpacity>
            <FlatList
                data={journals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.cover_url }} style={styles.cover} />
                        <View style={styles.rightContent}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text numberOfLines={2} style={styles.content}>{item.content}</Text>

                            <View style={styles.bottomRow}>
                                <View style={{ flex: 1 }}>
                                    {renderStatus(item.status, item.detail_status)}
                                </View>
                                <View style={styles.actionButtons}>
                                    {(item.status === 0 || item.status === 2) && (
                                        <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.editBtn}>
                                            <Text style={styles.btnText}>编辑</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
                                        <Text style={styles.btnText}>删除</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0'
    },
    publishButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10
    },
    publishText: {
        color: 'white',
        fontWeight: 'bold'
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginVertical: 6,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2
    },
    cover: {
        width: 100,
        height: 100,
        margin: 10
    },
    content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    body: {
        fontSize: 13,
        color: '#444'
    },
    reject: {
        fontSize: 12,
        color: 'red',
        marginTop: 4
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6
    },
    status: {
        fontSize: 12,
        color: '#555'
    },
    actions: {
        flexDirection: 'row',
        gap: 12
    },
    edit: {
        color: '#1976d2',
        fontSize: 13,
        marginRight: 8
    },
    delete: {
        color: '#e53935',
        fontSize: 13
    },
    rightContent: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
    },
    editBtn: {
        backgroundColor: '#337ab7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    deleteBtn: {
        backgroundColor: '#d9534f',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
    },
    rejectReason: {
        fontSize: 12,
        color: '#a94442',
        marginTop: 2,
    },
    pending: { color: 'orange', marginTop: 4 },
    approved: { color: 'green', marginTop: 4 },
    rejected: { color: 'red', marginTop: 4 },
    reason: { color: '#555', fontSize: 12 }
});

export default MyJournalsScreen;
