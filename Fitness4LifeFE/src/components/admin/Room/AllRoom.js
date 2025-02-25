import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, notification, Popconfirm, Table } from 'antd';
import moment from 'moment';
import { deleteRoom } from '../../../services/RoomService';
import DetailRoom from './DetailRoom';
import UpdateRoom from './UpdateRoom';
import '../../../assets/css/club.css';

function AllRoom(props) {
    const { loadRoom, dataRoom, filteredData, setFilteredData, setIsModalOpen,token } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (dataRoom && dataRoom.length > 0) {
            const uniqueRoomNames = [...new Set(dataRoom.map((room) => room.roomName))];
            const filters = uniqueRoomNames.map((roomName) => ({
                text: roomName,
                value: roomName,
            }));
            // Nếu cần filter theo room name, xử lý tại đây
        }
    }, [dataRoom]);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (_, record) => (
                <a
                    href="#"
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: 'Room Name',
            dataIndex: 'roomName',
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
        },
        {
            title: 'Available Seats',
            dataIndex: 'availableSeats',
        },
        {
            title: 'Facilities',
            dataIndex: 'facilities',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            render: (value) => `${value[0]}:${value[1] === 0 ? '00' : value[1]}`,
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            render: (value) => `${value[0]}:${value[1] === 0 ? '00' : value[1]}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            key="edit"
                            icon={<EditOutlined style={{ color: 'orange' }} />}
                            onClick={() => {
                                setDataUpdate(record);
                                setIsModalUpdateOpen(true);
                            }}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            key="delete"
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                        >
                            <Popconfirm
                                title="Delete Room"
                                description="Are you sure delete it?"
                                onConfirm={() => handleDeleteRoom(record.id)}
                                okText="Yes"
                                cancelText="No"
                                placement="left"
                            >
                                Delete
                            </Popconfirm>
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                        <MoreOutlined
                            style={{
                                fontSize: '18px',
                                cursor: 'pointer',
                                color: '#1890ff',
                            }}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const handleSearch = (value) => {
        const filtered = dataRoom.filter((item) =>
            item.roomName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleDeleteRoom = async (id) => {
        try {
            const res = await deleteRoom(id);
            if (res.status === 200 || res.data?.status === 200) {
                notification.success({
                    message: 'Delete Room',
                    description: 'Delete Room successfully!',
                });
                await loadRoom();
            } else {
                notification.error({
                    message: 'Error deleting room',
                    description: res.data?.message || 'Failed to delete room',
                });
            }
        } catch (error) {
            console.error("Delete room error:", error);
            notification.error({
                message: 'Error deleting room',
                description: error.response?.data?.message || 'An error occurred while deleting room',
            });
        }
    };

    return (
        <>
            <div>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Rooms</h2>
                    </div>
                    <div className="user-form">
                        <PlusOutlined
                            name="plus-circle"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                            style={{ marginRight: 15, color: '#FF6600' }}
                        />
                        <Input
                            placeholder="Search by name"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            onPressEnter={() => handleSearch(searchText)}
                            style={{ width: 450, marginBottom: 50, marginRight: 100, height: 35 }}
                        />
                    </div>
                </div>

                <Table
                    className="row-highlight-table"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={'id'}
                />
            </div>

            <UpdateRoom
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadRoom={loadRoom}
                token={token} 
            />

            <DetailRoom
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
                token={token} 
            />
        </>
    );
}

export default AllRoom;
