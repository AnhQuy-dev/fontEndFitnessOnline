import React, { useEffect, useState } from 'react';
import { Card, Modal, Button, notification, Layout, Typography, Spin, Menu, Row, Col, Select } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, BranchesOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import stickman from '../../../assets/images/Stickman.gif';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { fetchAllRooms } from '../../../serviceToken/RoomSERVICE';
import { getRoomOfPackageId, submitBookingRoom } from '../../../serviceToken/BookingMain';
import { fetchAllBranch } from '../../../serviceToken/BrachSERVICE';
import { getUserByEmail } from '../../../serviceToken/authService';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const BookingMain = () => {
    const navigate = useNavigate();
    const [allRooms, setAllRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [packageRooms, setPackageRooms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [branchLoading, setBranchLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [siderCollapsed, setSiderCollapsed] = useState(false);

    const tokenData = getTokenData();
    const decodeToken = getDecodedToken();

    const userId = decodeToken?.id;
    const userEmail = decodeToken?.sub;

    console.log("user", user);


    // Load user data and package rooms
    useEffect(() => {
        loadUserData();
    }, [tokenData?.access_token]);

    // Load package rooms when user data is available
    useEffect(() => {
        if (user?.workoutPackageId && tokenData?.access_token) {
            loadPackageRooms();
        }
    }, [user, tokenData?.access_token]);

    const loadPackageRooms = async () => {
        try {
            const packageId = user.workoutPackageId;
            console.log("packageId", packageId);
            const response = await getRoomOfPackageId(packageId, tokenData.access_token);
            console.log('Package Rooms Data:', response);
            setPackageRooms(response);
        } catch (error) {
            console.error('Package Rooms Error:', error);
            notification.error({
                message: 'Lỗi tải dữ liệu phòng của gói tập',
                description: error.message || 'Có lỗi xảy ra khi tải danh sách phòng của gói tập.',
            });
        }
    };

    const loadUserData = async () => {
        try {
            if (!userEmail || !tokenData?.access_token) return;

            const GetUser = await getUserByEmail(userEmail, tokenData.access_token);
            console.log("GetUser", GetUser);
            setUser(GetUser);
        } catch (error) {
            notification.error({
                message: 'Lỗi tải dữ liệu người dùng',
                description: error.message || 'Có lỗi xảy ra khi tải thông tin người dùng.',
            });
        }
    };

    // Load all branches
    useEffect(() => {
        const loadBranches = async () => {
            try {
                setBranchLoading(true);
                const branchesData = await fetchAllBranch(tokenData?.access_token);
                setBranches(branchesData.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi tải dữ liệu chi nhánh',
                    description: error.message || 'Có lỗi xảy ra khi tải danh sách chi nhánh.',
                });
            } finally {
                setBranchLoading(false);
            }
        };

        if (tokenData?.access_token) {
            loadBranches();
        }
    }, [tokenData?.access_token]);

    // Load all rooms
    useEffect(() => {
        const loadAllRooms = async () => {
            try {
                setLoading(true);
                const roomsData = await fetchAllRooms(tokenData?.access_token);
                setAllRooms(roomsData.data);
                setFilteredRooms(roomsData.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi tải dữ liệu phòng',
                    description: error.message || 'Có lỗi xảy ra khi tải danh sách phòng.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (tokenData?.access_token) {
            loadAllRooms();
        }
    }, [tokenData?.access_token]);

    // Filter rooms by branch
    const filterRoomsByBranch = (branchName) => {
        setSelectedBranch(branchName);
        if (!branchName || branchName === 'all') {
            setFilteredRooms(allRooms);
        } else {
            // Tìm branch có tên tương ứng
            const selectedBranchObj = branches.find(branch => branch.branchName === branchName);
            if (selectedBranchObj) {
                const filtered = allRooms.filter(room =>
                    room.trainer && room.trainer.branch &&
                    room.trainer.branch.id === selectedBranchObj.id
                );
                setFilteredRooms(filtered);
            } else {
                setFilteredRooms([]);
            }
        }
    };

    const openModal = (room) => {
        if (!tokenData) {
            notification.warning({
                message: 'Bạn chưa đăng nhập',
                description: 'Hãy đăng nhập để đặt phòng. Đang chuyển hướng...',
            });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleSubmitBooking = async () => {
        if (!selectedRoom) {
            notification.error({
                message: 'Lỗi đặt phòng',
                description: 'Vui lòng chọn phòng để đặt.',
            });
            return;
        }

        const bookingData = {
            userId: userId,
            roomId: selectedRoom.id,
        };

        try {
            const response = await submitBookingRoom(bookingData, tokenData.access_token);
            if (response.status === 201) {
                notification.success({
                    message: 'Đặt phòng thành công!',
                    description: `Bạn đã đặt phòng ${selectedRoom.roomName}.`,
                });
                setIsModalOpen(false);
            } else {
                throw new Error(response.data.message || 'Không thể đặt phòng.');
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi đặt phòng',
                description: error.message || 'Có lỗi xảy ra khi đặt phòng.',
            });
        }
    };

    // Modify the Card rendering part to check if room is in package
    const isRoomInPackage = (roomId) => {
        if (!Array.isArray(packageRooms)) {
            console.warn('packageRooms is not an array:', packageRooms);
            return false;
        }
        return packageRooms.some(packageRoom => packageRoom.id === roomId);
    };

    return (
        <section id="services">
            <Layout className="middle" style={{ background: '#f5f5f5', borderRadius: '10px' }}>
                <Row>
                    <Col xs={24}>
                        <Sider
                            width={200}
                            style={{ background: '#fff', height: '100%', minHeight: '100vh', position: 'fixed', left: 0, zIndex: 1 }}
                            collapsible
                            collapsed={siderCollapsed}
                            onCollapse={setSiderCollapsed}
                        >
                            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <Title level={5} style={{ margin: 0, textAlign: 'center' }}>
                                    <BranchesOutlined /> Chi nhánh
                                </Title>
                            </div>

                            {branchLoading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <Spin size="small" />
                                </div>
                            ) : (
                                <Menu
                                    mode="inline"
                                    selectedKeys={[selectedBranch]}
                                    style={{ borderRight: 0 }}
                                >
                                    <Menu.Item key="all" onClick={() => filterRoomsByBranch('all')}>
                                        Tất cả chi nhánh
                                    </Menu.Item>
                                    {branches.map(branch => (
                                        <Menu.Item
                                            key={branch.branchName}
                                            onClick={() => filterRoomsByBranch(branch.branchName)}
                                        >
                                            {branch.branchName}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            )}
                        </Sider>
                    </Col>

                    <Col xs={24} style={{ marginLeft: siderCollapsed ? '80px' : '200px' }}>
                        <Content style={{
                            padding: '0 16px',
                            maxWidth: '1600px',
                            margin: '0 auto',
                            marginTop: '16px'
                        }}>
                            <Row justify="center" style={{ width: '100%', margin: 0 }}>
                                <Col xs={24} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: 0
                                }}>
                                    {/* Loading Spinner */}
                                    {loading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                                            <img src={stickman} alt="Loading..." width={100} height={100} />
                                        </div>
                                    ) : filteredRooms.length === 0 ? (
                                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                                            <Text type="secondary">Không có phòng nào khả dụng.</Text>
                                        </div>
                                    ) : (
                                        filteredRooms.map((room) => (
                                            <Card
                                                key={room.id}
                                                style={{
                                                    marginBottom: '16px',
                                                    width: '95%',
                                                    maxWidth: '1200px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}
                                                bodyStyle={{ padding: '24px' }}
                                                hoverable
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <Title level={4} style={{ marginBottom: '16px' }}>{room.roomName}</Title>

                                                        <div style={{ marginBottom: '8px' }}>
                                                            <BranchesOutlined style={{ marginRight: '8px' }} />
                                                            <Text>{room.trainer?.branch?.branchName || 'Chi nhánh chưa xác định'}</Text>
                                                        </div>

                                                        <div style={{ marginBottom: '8px' }}>
                                                            <CalendarOutlined style={{ marginRight: '8px' }} />
                                                            <Text>{`${room.startTime[0]}:${room.startTime[1].toString().padStart(2, '0')} - ${room.endTime[0]}:${room.endTime[1].toString().padStart(2, '0')}`}</Text>
                                                        </div>

                                                        <div style={{ marginBottom: '8px' }}>
                                                            <EnvironmentOutlined style={{ marginRight: '8px' }} />
                                                            <Text>{room.facilities}</Text>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <UserOutlined style={{ marginRight: '4px' }} />
                                                        <Text type="secondary">
                                                            {room.availableSeats}/{room.capacity}
                                                        </Text>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="primary"
                                                    danger
                                                    block
                                                    style={{
                                                        marginTop: '16px',
                                                        opacity: isRoomInPackage(room.id) ? 1 : 0.5,
                                                        cursor: isRoomInPackage(room.id) ? 'pointer' : 'not-allowed'
                                                    }}
                                                    disabled={!isRoomInPackage(room.id)}
                                                    onClick={(e) => {
                                                        if (isRoomInPackage(room.id)) {
                                                            e.stopPropagation();
                                                            openModal(room);
                                                        }
                                                    }}
                                                >
                                                    {isRoomInPackage(room.id) ? 'Đặt lịch' : 'Không thuộc gói tập của bạn'}
                                                </Button>
                                            </Card>
                                        ))
                                    )}
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                </Row>

                <Modal
                    title={`Đặt phòng: ${selectedRoom?.roomName}`}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" danger onClick={handleSubmitBooking}>
                            Xác nhận đặt phòng
                        </Button>,
                    ]}
                >
                    {selectedRoom && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <Text strong>Chi nhánh: </Text>
                                <Text>{selectedRoom.trainer?.branch?.branchName || 'Chi nhánh chưa xác định'}</Text>
                            </div>
                            <div>
                                <Text strong>Ngày: </Text>
                                <Text>{selectedDate.toLocaleDateString()}</Text>
                            </div>
                            <div>
                                <Text strong>Thời gian: </Text>
                                <Text>{`${selectedRoom.startTime[0]}:${selectedRoom.startTime[1].toString().padStart(2, '0')} - ${selectedRoom.endTime[0]}:${selectedRoom.endTime[1].toString().padStart(2, '0')}`}</Text>
                            </div>
                            <div>
                                <Text strong>Số chỗ trống: </Text>
                                <Text>{selectedRoom.availableSeats}/{selectedRoom.capacity}</Text>
                            </div>
                            <div>
                                <Text strong>Tiện nghi: </Text>
                                <Text>{selectedRoom.facilities}</Text>
                            </div>
                            <div>
                                <Text strong>Huấn luyện viên: </Text>
                                <Text>{selectedRoom.trainer?.fullName || 'Chưa có HLV'}</Text>
                            </div>
                        </div>
                    )}
                </Modal>
            </Layout>
        </section>
    );
};

export default BookingMain;