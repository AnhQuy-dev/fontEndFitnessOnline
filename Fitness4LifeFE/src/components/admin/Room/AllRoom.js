import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, notification, Popconfirm, Table, Tag } from 'antd';
import DetailRoom from './DetailRoom';
import UpdateRoom from './UpdateRoom';
import '../../../assets/css/club.css';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import { deleteRoom, updateRoom } from '../../../serviceToken/RoomSERVICE';

function AllRoom(props) {
    const { loadRoom, dataRoom, filteredData, setFilteredData, setIsModalOpen, token } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');

    const tokenData = getTokenData();//tokenData.access_token

    useEffect(() => {
        if (dataRoom && dataRoom.length > 0) {
            const uniqueRoomNames = [...new Set(dataRoom.map((room) => room.roomName))];
        }
    }, [dataRoom]);


    const handleStatusChange = async (record) => {
        try {
            const updatedRoom = {
                club: record.trainer.branch.id,
                trainer: record.trainer.id,
                roomName: record.roomName,
                slug: record.slug,
                capacity: record.capacity,
                facilities: record.facilities,
                status: !record.status,
                startTime: record.startTime,
                endTime: record.endTime
            };

            console.log("Request data:", {
                roomId: record.id,
                updatedRoom: updatedRoom,
                token: tokenData.access_token
            });

            const response = await updateRoom(record.id, updatedRoom, tokenData.access_token);
            console.log("API Response:", response);

            if (response.status === 200 || response.status === 201) {
                notification.success({
                    message: 'Update Status',
                    description: `Room status has been ${updatedRoom.status ? 'activated' : 'deactivated'} successfully!`,
                });
                await loadRoom();
            } else {
                console.log("Error details:", {
                    status: response.status,
                    data: response.data,
                    message: response.data?.message
                });

                notification.error({
                    message: 'Error updating status',
                    description: response.data?.message || 'Failed to update room status',
                });
            }
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error response:", error.response);

            notification.error({
                message: 'Error updating status',
                description: error.response?.data?.message || 'An error occurred while updating room status',
            });
        }
    };

    const columns = [
        {
            title: 'Room Name',
            dataIndex: 'roomName',
            render: (_, record) => (
                <a
                    href="#"
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.roomName}
                </a>
            ),
        },
        {
            title: 'Club Name',
            dataIndex: 'club',
            render: (club) => club.name || 'N/A',
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
            title: 'Status',
            dataIndex: 'status',
            render: (status, record) => (
                <Popconfirm
                    title={`${status ? 'Deactivate' : 'Activate'} Room`}
                    description={`Are you sure you want to ${status ? 'deactivate' : 'activate'} this room?`}
                    onConfirm={() => handleStatusChange(record)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                >
                    <Tag
                        color={status ? 'green' : 'red'}
                        style={{ cursor: 'pointer' }}
                    >
                        {status ? 'Active' : 'Inactive'}
                    </Tag>
                </Popconfirm>
            ),
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

    // const handleDeleteRoom = async (id) => {
    //     try {
    //         const response = await deleteRoom(id, tokenData.access_token);
    //         if (response.status === 200 || response.status === 201) {
    //             notification.success({
    //                 message: 'Delete Room',
    //                 description: 'Delete Room successfully!',
    //             });
    //             await loadRoom();
    //         } else {
    //             notification.error({
    //                 message: 'Error deleting room',
    //                 description: response.data?.message || 'Failed to delete room',
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Delete room error:", error);
    //         notification.error({
    //             message: 'Error deleting room',
    //             description: error.response?.data?.message || 'An error occurred while deleting room',
    //         });
    //     }
    // };

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