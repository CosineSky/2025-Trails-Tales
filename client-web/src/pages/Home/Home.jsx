import './Home.css';
import React, {useState, useEffect, useMemo} from 'react';
import {
    Tag,
    Table,
    Modal,
    Input,
    Space,
    Select,
    Button,
    message,
    Tooltip,
} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {
    DeleteOutlined,
    DislikeOutlined,
    DislikeTwoTone,
    FileTwoTone,
    InfoCircleOutlined,
    LikeOutlined,
    LikeTwoTone,
    VideoCameraTwoTone
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';
import {_HOST_IP, _HOST_PORT} from "../../config";


/*
    Server IP
 */
const API_URL = `http://${_HOST_IP}:${_HOST_PORT}/api`;

const { Option } = Select;
const statusMap = {
    0: { text: '待审核', color: 'blue' },
    1: { text: '已通过', color: 'green' },
    2: { text: '未通过', color: 'orange' },
    3: { text: '已删除', color: 'red' },
};


const TravelNoteAdmin = () => {
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState('0');
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [sortOption, setSortOption] = useState(null);

    const [selectedJournal, setSelectedJournal] = useState(null);
    const [journals, setJournals] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);
    const currentRole = localStorage.getItem('role');


    useEffect(() => {
        axios.get(`${API_URL}/journals/all`)
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
        let result = journals?.filter((journal) => {
            const statusMatch =
                statusFilter === 'all' || journal.status === parseInt(statusFilter);
            const titleMatch = journal.title
                .toLowerCase()
                .includes(searchTitle.toLowerCase());
            const authorMatch = journal.owner_nickname
                .toLowerCase()
                .includes(searchAuthor.toLowerCase());
            return statusMatch && titleMatch && authorMatch;
        });

        if (sortOption === 'created_at_desc') {
            result = result?.slice().sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOption === 'created_at_asc') {
            result = result?.slice().sort((a, b) =>
                new Date(a.created_at) - new Date(b.created_at));
        } else if (sortOption === 'status_asc') {
            result = result?.slice().sort((a, b) =>
                a.status - b.status);
        } else if (sortOption === 'status_desc') {
            result = result?.slice().sort((a, b) =>
                b.status - a.status);
        }

        return result;
    }, [statusFilter, searchTitle, searchAuthor, journals, sortOption]);



    const columns = [
        {
            title: '游记标题',
            dataIndex: 'title',
            key: 'title',
            width: 500,
        },
        {
            title: '作者',
            dataIndex: 'owner_nickname',
            key: 'owner_nickname',
            width: 200,
        },
        {
            title: '发布时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 200,
            render: (timestamp) => {
                return `${timestamp.substring(0, 10)}`;
            },
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (status, record) => {
                const { text, color } = statusMap[status] || {};
                return (
                    <>
                        <Tag color={color}>{text}</Tag>
                        {status === 2 && record.detail_status && (
                            <Tooltip title={`拒绝原因：${record.detail_status}`}>
                                <InfoCircleOutlined
                                    style={{ color: '#ff862e' }} />
                            </Tooltip>
                        )}
                    </>
                );
            },
        },

        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Tooltip title="查看详情">
                        <Button
                            onClick={() => handleViewDetails(record)}
                            icon={<FileTwoTone />}
                        >{/**/}
                        </Button>
                    </Tooltip>
                    <Tooltip title="通过">
                        <Button
                            onClick={() => handleApprove(record)}
                            disabled={record.status === 1 || record.status === 3}
                            icon={record.status === 1 || record.status === 3
                                ? <LikeOutlined /> : <LikeTwoTone />}
                        >{/**/}
                        </Button>
                    </Tooltip>
                    <Tooltip title="拒绝">
                        <Button
                            onClick={() => handleReject(record)}
                            disabled={record.status === 2 || record.status === 3}
                            icon={record.status === 2 || record.status === 3
                                ? <DislikeOutlined /> : <DislikeTwoTone />}
                        >{/**/}
                        </Button>
                    </Tooltip>
                    {currentRole === '2' && (
                        <Tooltip title="删除">
                            <Button
                                onClick={() => handleDelete(record)}
                                disabled={record.status === 3}
                                icon={<DeleteOutlined />}
                                danger
                            >{/**/}
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];


    const handleApprove = (record) => {
        axios.put(`${API_URL}/journals/approve/${record.id}`)
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
                axios.put(`${API_URL}/journals/reject/${record.id}`, { rejectionReason: inputReason })
                    .then((response) => {
                        message
                            .success(response.data.message)
                            .then(r => {});
                        const updatedJournals = journals.map((item) =>
                            item.id === record.id
                                ? { ...item, status: 2, rejectionReason: inputReason }
                                : item
                        );
                        setJournals(updatedJournals);
                    })
                    .catch((err) => {
                        message.error(`拒绝操作失败: ${err}`);
                    });
            },
        });
    };


    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `您确定要删除《${record.title}》这篇游记吗？`,
            onOk: () => {
                axios.put(`${API_URL}/journals/delete/${record.id}`)
                    .then((response) => {
                        message
                            .success(response.data.message)
                            .then(r => {});
                        const updatedJournals = journals.map((item) =>
                            item.id === record.id
                                ? { ...item, status: 3 }
                                : item
                        );
                        setJournals(updatedJournals);
                    })
                    .catch((err) => {
                        message.error(`删除操作失败: ${err}`);
                    });
            },
        });
    };


    const handleViewDetails = async (record) => {
        // setSelectedJournal(record);
        try {
            const res = await axios.get(
                `${API_URL}/journals/getById?search=${record.id}`);
            setSelectedJournal(res.data);
        } catch (err) {
            message.error(`加载游记详情失败: ${err}`);
        }
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
                                {value: '3', label: '已删除'},
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
                        <Select
                            placeholder="排序方式"
                            style={{ width: 160 }}
                            onChange={(value) => setSortOption(value)}
                            allowClear
                        >
                            <Option value="created_at_desc">按发布时间降序</Option>
                            <Option value="created_at_asc">按发布时间升序</Option>
                            <Option value="status_asc">按状态升序</Option>
                            <Option value="status_desc">按状态降序</Option>
                        </Select>
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
                        {/* 所有图片展示 */}
                        <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 8,
                            paddingBottom: 8
                        }}>
                            {selectedJournal.pictures.length > 0
                                ? selectedJournal.pictures.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`journal-img-${index}`}
                                    style={{ width: '48%', height: 'auto', borderRadius: 6 }}
                                />
                            )) : (
                                <img
                                    src={selectedJournal.cover_url}
                                    alt="cover"
                                    style={{ width: 600, height: 'auto' }}
                                />
                            )}
                        </div>
                        <p>{selectedJournal.content}</p>
                        <p>
                            <strong>视频链接：</strong>
                            {selectedJournal.video_url ? (
                                <Button
                                    icon={<VideoCameraTwoTone />}
                                    onClick={() => {
                                        window.open(selectedJournal.video_url, '_blank')
                                    }}
                                >Video</Button>
                            ) : ("无")}
                        </p>
                    </div>
                </Modal>
            )}


        </div>
    );
};

export default TravelNoteAdmin;
