import React, { useEffect, useState } from 'react';
import {
    Card, Modal, Button, notification, Layout, Typography,
    Spin, Menu, Row, Col, Select, Divider, Badge, Tag
} from 'antd';
import {
    CalendarOutlined, EnvironmentOutlined, UserOutlined,
    BranchesOutlined, FilterOutlined, TeamOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import stickman from '../../../assets/images/Stickman.gif';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { fetchAllRooms } from '../../../serviceToken/RoomSERVICE';
import { getRoomOfPackageId, submitBookingRoom } from '../../../serviceToken/BookingMain';
import { fetchAllClubs } from '../../../serviceToken/ClubService';
import { getUserByEmail } from '../../../serviceToken/authService';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const BookingMain = () => {
    const navigate = useNavigate();
    const [allRooms, setAllRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [packageRooms, setPackageRooms] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [clubLoading, setClubLoading] = useState(true);
    const [user, setUser] = useState(null);

    const tokenData = getTokenData();
    const decodeToken = getDecodedToken();

    const userId = decodeToken?.id;
    const userEmail = decodeToken?.sub;

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

    // Load user data and package rooms
    useEffect(() => {
        loadUserData();
    }, [tokenData?.access_token]);

    // Handle storage event for room status updates
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'room_status_updated') {
                if (tokenData?.access_token) {
                    loadRooms();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const roomUpdated = localStorage.getItem('room_status_updated');
        if (roomUpdated) {
            const updateInfo = JSON.parse(roomUpdated);
            if (Date.now() - updateInfo.timestamp < 5000) {
                if (tokenData?.access_token) {
                    loadRooms();
                }
            }
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [tokenData?.access_token]);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const roomsData = await fetchAllRooms(tokenData.access_token);
            const activeRooms = roomsData.data.filter(room => room.status === true);
            setAllRooms(activeRooms);
            setFilteredRooms(activeRooms);
        } catch (error) {
            console.error('Error loading rooms:', error);
            notification.error({
                message: 'Lỗi tải dữ liệu phòng',
                description: error.message || 'Có lỗi xảy ra khi tải danh sách phòng.',
            });
        } finally {
            setLoading(false);
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

    // Load all clubs
    useEffect(() => {
        const loadClubs = async () => {
            try {
                setClubLoading(true);
                const clubsData = await fetchAllClubs(tokenData?.access_token);
                setClubs(clubsData.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi tải dữ liệu câu lạc bộ',
                    description: error.message || 'Có lỗi xảy ra khi tải danh sách câu lạc bộ.',
                });
            } finally {
                setClubLoading(false);
            }
        };

        if (tokenData?.access_token) {
            loadClubs();
        }
    }, [tokenData?.access_token]);

    // Load all rooms
    useEffect(() => {
        if (tokenData?.access_token) {
            loadRooms();
        }
    }, [tokenData?.access_token]);

    // Filter rooms by club
    const filterRoomsByClub = (clubName) => {
        setSelectedClub(clubName);
        if (!clubName || clubName === 'all') {
            setFilteredRooms(allRooms);
        } else {
            const selectedClubObj = clubs.find(club => club.name === clubName);
            if (selectedClubObj) {
                const filtered = allRooms.filter(room =>
                    room.trainer && room.club &&
                    room.club.id === selectedClubObj.id
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
            roomId: selectedRoom.id

        };
        console.log("bookingData", bookingData);

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

    // Check if room is in package
    const isRoomInPackage = (roomId) => {
        if (!Array.isArray(packageRooms)) {
            console.warn('packageRooms is not an array:', packageRooms);
            return false;
        }
        return packageRooms.some(packageRoom => packageRoom.id === roomId);
    };

    // Format time
    const formatTime = (timeArray) => {
        if (!timeArray || timeArray.length < 2) return 'N/A';
        return `${timeArray[0]}:${timeArray[1].toString().padStart(2, '0')}`;
    };

    return (
        <section id="services" style={{ backgroundColor: '#f7f9fc', minHeight: '100vh', padding: '24px 0' }}>
            <Layout className="booking-container" style={{ maxWidth: '1440px', margin: '0 auto', background: 'transparent' }}>
                {/* Filter Section - Moved to top */}
                <div className="filter-section" style={{
                    padding: '16px 24px',
                    background: 'white',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <Row align="middle" gutter={[16, 16]}>
                        <Col xs={24} sm={8} md={6}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FilterOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                                <Title level={5} style={{ margin: 0 }}>Lọc theo câu lạc bộ</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={16} md={18}>
                            {clubLoading ? (
                                <div style={{ padding: '8px', textAlign: 'center' }}>
                                    <Spin size="small" />
                                </div>
                            ) : (
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn câu lạc bộ"
                                    value={selectedClub}
                                    onChange={filterRoomsByClub}
                                    suffixIcon={<BranchesOutlined />}
                                >
                                    <Option value="all">Tất cả câu lạc bộ</Option>
                                    {clubs.map(club => (
                                        <Option key={club.name} value={club.name}>
                                            {club.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Col>
                    </Row>
                </div>

                {/* Room Cards Section */}
                <Content style={{ padding: '0', background: 'transparent' }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '50px',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <img src={stickman} alt="Loading..." width={120} height={120} />
                            <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>Đang tải danh sách phòng...</Text>
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '50px',
                            padding: '32px',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <BranchesOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                            <div>
                                <Text style={{ fontSize: '16px', color: '#8c8c8c' }}>
                                    Không có phòng nào khả dụng cho lựa chọn hiện tại.
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                style={{ marginTop: '16px' }}
                                onClick={() => filterRoomsByClub('all')}
                            >
                                Xem tất cả phòng
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Row gutter={[16, 16]}>
                                {filteredRooms.map((room) => (
                                    <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={room.id}>
                                        <Card
                                            hoverable
                                            className="room-card"
                                            style={{
                                                height: '100%',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                border: isRoomInPackage(room.id) ? '1px solid #52c41a' : '1px solid #f0f0f0',
                                                position: 'relative'
                                            }}
                                            cover={
                                                <div style={{
                                                    height: '140px',
                                                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'white',
                                                    padding: '16px',
                                                    position: 'relative'
                                                }}>
                                                    {isRoomInPackage(room.id) && (
                                                        <Tag
                                                            color="#52c41a"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '8px',
                                                                right: '8px',
                                                                margin: 0,
                                                                padding: '4px 8px',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            Có thể đặt
                                                        </Tag>
                                                    )}
                                                    <Title level={4} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
                                                        {room.roomName}
                                                    </Title>
                                                    <Text style={{ color: 'rgba(255, 255, 255, 0.85)', marginTop: '8px' }}>
                                                        {room.club.name || 'Câu lạc bộ chưa xác định'}
                                                    </Text>
                                                </div>
                                            }
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '12px'
                                                }}>
                                                    <Tag color="blue" icon={<ClockCircleOutlined />} style={{ padding: '4px 8px' }}>
                                                        {`${formatTime(room.startTime)} - ${formatTime(room.endTime)}`}
                                                    </Tag>
                                                    <Tag color="orange" icon={<TeamOutlined />}>
                                                        {`${room.availableSeats}/${room.capacity}`}
                                                    </Tag>
                                                </div>

                                                <div style={{ marginBottom: '8px' }}>
                                                    <Text type="secondary" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <EnvironmentOutlined style={{ marginRight: '8px', marginTop: '4px' }} />
                                                        <span>{room.facilities}</span>
                                                    </Text>
                                                </div>
                                            </div>

                                            <Divider style={{ margin: '12px 0' }} />

                                            <Button
                                                type={isRoomInPackage(room.id) ? "primary" : "default"}
                                                danger={isRoomInPackage(room.id)}
                                                block
                                                style={{
                                                    borderRadius: '4px',
                                                    fontWeight: isRoomInPackage(room.id) ? 'bold' : 'normal',
                                                }}
                                                disabled={!isRoomInPackage(room.id)}
                                                onClick={() => {
                                                    if (isRoomInPackage(room.id)) {
                                                        openModal(room);
                                                    }
                                                }}
                                            >
                                                {isRoomInPackage(room.id) ? 'Đặt lịch ngay' : 'Không thuộc gói tập'}
                                            </Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Content>

                {/* Booking Modal */}
                <Modal
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BranchesOutlined style={{ color: '#1890ff' }} />
                            <span>Đặt phòng: {selectedRoom?.roomName}</span>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    width={500}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={handleSubmitBooking}
                            icon={<CalendarOutlined />}
                        >
                            Xác nhận đặt phòng
                        </Button>,
                    ]}
                >
                    {selectedRoom && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            padding: '16px',
                            background: '#f7f9fc',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <BranchesOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Câu lạc bộ: </Text>
                                <Text>{selectedRoom.club.name || 'Câu lạc bộ chưa xác định'}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Ngày: </Text>
                                <Text>{selectedDate.toLocaleDateString()}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Thời gian: </Text>
                                <Text>{`${formatTime(selectedRoom.startTime)} - ${formatTime(selectedRoom.endTime)}`}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <TeamOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Số chỗ trống: </Text>
                                <Text>{selectedRoom.availableSeats}/{selectedRoom.capacity}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <EnvironmentOutlined style={{ color: '#1890ff', marginTop: '4px' }} />
                                <Text strong>Tiện nghi: </Text>
                                <Text>{selectedRoom.facilities}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <UserOutlined style={{ color: '#1890ff' }} />
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