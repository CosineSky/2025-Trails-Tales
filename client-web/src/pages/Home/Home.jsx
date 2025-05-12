import './Home.css';
import React, {useState, useEffect, useMemo} from 'react';
import { Table, Tag, Select, Space, Button, Modal, Input, message } from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import logo from '../../assets/images/logo.png';


const HOST_IP = '115.175.40.241';


const { Option } = Select;
const statusMap = {
    0: { text: '待审核', color: 'blue' },
    1: { text: '已通过', color: 'green' },
    2: { text: '未通过', color: 'orange' },
    3: { text: '已删除', color: 'red' },
};

const TravelNoteAdmin = () => {
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');

    const [selectedJournal, setSelectedJournal] = useState(null);
    const [journals, setJournals] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);
    const currentRole = localStorage.getItem('role');


    useEffect(() => {
        axios.get(`http://${HOST_IP}:5000/api/journals/all`)
            .then((res) => {
                setJournals(res.data);
            })
            .catch((err) => {
                message.error(err + '获取游记数据失败！');
                console.log(err);
            })
            .finally(() => setLoading(false));
    }, []);


    const filteredData = useMemo(() => {
        return journals?.filter((journal) => {
            const statusMatch =
                statusFilter === 'all' || journal.status === parseInt(statusFilter);
            const titleMatch = journal.title
                .toLowerCase()
                .includes(searchTitle.toLowerCase());
            const authorMatch = (`用户${journal.owner_id}`)
                .toLowerCase()
                .includes(searchAuthor.toLowerCase());
            return statusMatch && titleMatch && authorMatch;
        });
    }, [statusFilter, searchTitle, searchAuthor, journals]);


    const columns = [
        {
            title: '游记标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '作者',
            dataIndex: 'owner_id',
            key: 'owner_id',
            render: (owner_id) => `用户${owner_id}`,
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const { text, color } = statusMap[status] || {};
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button onClick={() => handleApprove(record)} disabled={record.status === 1}>
                        通过
                    </Button>
                    <Button
                        onClick={() => handleReject(record)}
                        disabled={record.status === 2}
                    >
                        拒绝
                    </Button>
                    {currentRole === '2' && (
                        <Button onClick={() => handleDelete(record)} danger>
                            删除
                        </Button>
                    )}
                    <Button onClick={() => handleViewDetails(record)} type="link">
                        详情
                    </Button>
                </Space>
            ),
        },
    ];


    const handleApprove = (record) => {
        axios.put(`http://${HOST_IP}:5000/api/journals/approve/${record.id}`)
            .then((response) => {
                message.success(response.data.message);
                // 更新前端状态
                const updatedJournals = journals.map((item) =>
                    item.id === record.id ? { ...item, status: 1 } : item
                );
                setJournals(updatedJournals);
            })
            .catch((err) => {
                console.log(err);
                message.error('审核操作失败');
            });
    };


    const handleReject = (record) => {
        let inputReason = ''; // 局部变量存储输入值

        Modal.confirm({
            title: '拒绝理由',
            content: (
                <Input
                    placeholder="请输入拒绝理由"
                    onChange={(e) => {
                        inputReason = e.target.value;
                    }}
                    autoFocus
                />
            ),
            onOk: () => {
                if (!inputReason) {
                    message.error('请填写拒绝理由');
                    return Promise.reject(); // 阻止 Modal 自动关闭
                }

                console.log(inputReason, record.id);

                axios.put(`http://${HOST_IP}:5000/api/journals/reject/${record.id}`, { rejectionReason: inputReason })
                    .then((response) => {
                        message.success(response.data.message);
                        // 更新前端状态
                        const updatedJournals = journals.map((item) =>
                            item.id === record.id ? { ...item, status: 2, rejectionReason: inputReason } : item
                        );
                        setJournals(updatedJournals);
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error('拒绝操作失败');
                    });
            },
        });
    };


    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `您确定要删除《${record.title}》这篇游记吗？`,
            onOk: () => {
                axios.put(`http://${HOST_IP}:5000/api/journals/delete/${record.id}`)
                    .then((response) => {
                        message.success(response.data.message);
                        // 更新前端状态
                        const updatedJournals = journals.map((item) =>
                            item.id === record.id ? { ...item, deleted: true } : item
                        );
                        setJournals(updatedJournals);
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error('删除操作失败');
                    });
            },
        });
    };


    const handleViewDetails = (record) => {
        setSelectedJournal(record);
    };

    const handleModalClose = () => {
        setSelectedJournal(null);
    };

    const handleLogout = () => {
        message.success('已退出登录！');
        navigate('/login');
    };

    return (
        <div className="bg-wrapper">
            <div className="header-bar">
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center"}}>
                    <img src={logo} alt="logo" className="logo-img" style={{width: '40px'}} />
                    <div style={{fontSize: '24px', margin: '5px 0 0 5px'}} className="header-left">游记审核管理系统</div>
                </div>
                <div className="header-right" onClick={() => handleLogout()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-power-icon lucide-power">
                        <path d="M12 2v10"/>
                        <path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>
                    </svg>
                </div>
            </div>

            <div className="wrapper">
                <div className="panel" style={{padding: 24}}>
                    <Space style={{marginBottom: 16, flexWrap: 'wrap'}}>
                        <svg style={{color: '#ffffff' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="lucide lucide-search-icon lucide-search">
                            <path d="m21 21-4.34-4.34"/>
                            <circle cx="11" cy="11" r="8"/>
                        </svg>
                        <Select
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{width: 160}}
                            options={[
                                {value: 'all', label: '全部状态'},
                                {value: '0', label: '待审核'},
                                {value: '1', label: '已通过'},
                                {value: '2', label: '未通过'},
                            ]}
                        />
                        <Input
                            placeholder="搜索标题"
                            allowClear
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            style={{width: 200, backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
                        />
                        <Input
                            placeholder="搜索作者名"
                            allowClear
                            value={searchAuthor}
                            onChange={(e) => setSearchAuthor(e.target.value)}
                            style={{width: 200, backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
                        />
                    </Space>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{pageSize: 8}}
                    />
                </div>
            </div>

            {selectedJournal && (
                <Modal
                    title={selectedJournal.title}
                    visible={true}
                    onCancel={handleModalClose}
                    footer={null}
                    width={800}
                >
                    <div>
                        <img
                            src={selectedJournal.cover_url}
                            alt="cover"
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <p>{selectedJournal.content}</p>
                        <p>
                            <strong>视频链接：</strong>
                            <a
                                href={selectedJournal.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {selectedJournal.video_url}
                            </a>
                        </p>
                        <p>
                            <strong>浏览量：</strong>{selectedJournal.view_count}
                        </p>
                        <p>
                            <strong>点赞数：</strong>{selectedJournal.like_count}
                        </p>
                        <p>
                            <strong>创建时间：</strong>{selectedJournal.created_at}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TravelNoteAdmin;
