import React, { useEffect, useState } from 'react';
import {
    Card, Modal, Button, notification, Layout, Typography,
    Spin, Menu, Row, Col, Select, Divider, Badge, Tag, Pagination
} from 'antd';
import {
    CalendarOutlined, EnvironmentOutlined, UserOutlined,
    BranchesOutlined, FilterOutlined, TeamOutlined, ClockCircleOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import stickman from '../../../assets/images/Stickman.gif';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { fetchAllRooms } from '../../../serviceToken/RoomSERVICE';
import { getRoomOfPackageId, submitBookingRoom } from '../../../serviceToken/BookingMain';
import { fetchAllClubs } from '../../../serviceToken/ClubService';
import { getUserByEmail } from '../../../serviceToken/authService';

const { Content, Sider } = Layout;
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
    const [hasWorkoutPackage, setHasWorkoutPackage] = useState(false);

    // Pagination states - updated to show 6 rooms per page
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalRooms, setTotalRooms] = useState(0);

    const tokenData = getTokenData();
    const decodeToken = getDecodedToken();

    const userId = decodeToken?.id;
    const userEmail = decodeToken?.sub;

    // Navigate to package page
    const navigateToPackage = () => {
        navigate('/packageMain');
    };

    // Load package rooms when user data is available
    useEffect(() => {
        if (user) {
            // Check if user has a workout package
            setHasWorkoutPackage(!!user.workoutPackageId);

            if (user.workoutPackageId && tokenData?.access_token) {
                loadPackageRooms();
            }
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
            setTotalRooms(activeRooms.length);
            setCurrentPage(1);
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
        setCurrentPage(1);

        if (!clubName || clubName === 'all') {
            setFilteredRooms(allRooms);
            setTotalRooms(allRooms.length);
        } else {
            const selectedClubObj = clubs.find(club => club.name === clubName);
            if (selectedClubObj) {
                const filtered = allRooms.filter(room =>
                    room.trainer && room.club &&
                    room.club.id === selectedClubObj.id
                );
                setFilteredRooms(filtered);
                setTotalRooms(filtered.length);
            } else {
                setFilteredRooms([]);
                setTotalRooms(0);
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
                message: 'Error',
                description: 'Please select room.',
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
                    message: 'Success!',
                    description: `You was booked ${selectedRoom.roomName}.`,
                });
                setIsModalOpen(false);
            } else {
                throw new Error(response.data.message || 'Can not book.');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
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

    // Pagination change handler
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get current rooms for the current page
    const getCurrentRooms = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredRooms.slice(startIndex, endIndex);
    };

    return (
        <section id="services" style={{ backgroundColor: '#f7f9fc', minHeight: '100vh', padding: '24px 0' }}>
            <Layout className="booking-container" style={{ maxWidth: '1440px', margin: '0 auto', background: 'transparent' }}>
                <Layout style={{ background: 'transparent' }}>
                    {/* Left side filter section */}
                    <Sider
                        width={280}
                        theme="light"
                        style={{
                            background: 'white',
                            borderRadius: '8px',
                            marginRight: '24px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            height: 'fit-content'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <FilterOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                            <Title level={4} style={{ margin: 0 }}>Filter By Club</Title>
                        </div>

                        <Divider style={{ margin: '12px 0' }} />

                        {clubLoading ? (
                            <div style={{ padding: '8px', textAlign: 'center' }}>
                                <Spin size="small" />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Button
                                    type={selectedClub === 'all' ? "primary" : "default"}
                                    icon={<BranchesOutlined />}
                                    block
                                    onClick={() => filterRoomsByClub('all')}
                                    style={{
                                        textAlign: 'left',
                                        borderRadius: '6px',
                                        fontWeight: selectedClub === 'all' ? 'bold' : 'normal'
                                    }}
                                >
                                    All Clubs
                                </Button>

                                {clubs.map(club => (
                                    <Button
                                        key={club.name}
                                        type={selectedClub === club.name ? "primary" : "default"}
                                        block
                                        onClick={() => filterRoomsByClub(club.name)}
                                        style={{
                                            textAlign: 'left',
                                            borderRadius: '6px',
                                            fontWeight: selectedClub === club.name ? 'bold' : 'normal'
                                        }}
                                    >
                                        {club.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </Sider>

                    {/* Right side content with rooms */}
                    <Content style={{ padding: '0', background: 'transparent' }}>
                        {/* Title for the Room section with conditionally rendered "Go To Pay" button */}
                        <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '16px 24px',
                            marginBottom: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            <Title level={4} style={{ margin: 0 }}>Available Rooms</Title>

                            {!hasWorkoutPackage && user && (
                                <Button
                                    size="large"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={navigateToPackage}
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#ff6b01',
                                        borderColor: 'black',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Go To Pay
                                </Button>
                            )}

                            <Text>Showing {getCurrentRooms().length} of {totalRooms} rooms</Text>
                        </div>

                        {loading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '50px',
                                flexDirection: 'column',
                                gap: '16px',
                                background: 'white',
                                padding: '50px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
                                {/* Room Cards - 3 columns */}
                                <Row gutter={[16, 16]}>
                                    {getCurrentRooms().map((room) => (
                                        <Col xs={24} sm={12} md={8} key={room.id}>
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
                                                                Available
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
                                                            <UserOutlined style={{ marginRight: '8px' }} />
                                                            {room.trainer?.fullName || 'Chưa có HLV'}
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
                                                    {isRoomInPackage(room.id) ? 'Book now' : 'You need to pay before booking this room'}
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Pagination */}
                                {filteredRooms.length > 0 && (
                                    <div style={{
                                        marginTop: '32px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        background: 'white',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                    }}>
                                        <Pagination
                                            current={currentPage}
                                            total={totalRooms}
                                            pageSize={pageSize}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                            showQuickJumper
                                            showTotal={(total) => `Tổng cộng ${total} phòng`}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </Content>
                </Layout>

                {/* Booking Modal */}
                <Modal
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BranchesOutlined style={{ color: '#1890ff' }} />
                            <span>Room : {selectedRoom?.roomName}</span>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    width={500}
                    footer={[
                        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={handleSubmitBooking}
                            icon={<CalendarOutlined />}
                        >
                            Confirm book
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
                                <Text strong>Club: </Text>
                                <Text>{selectedRoom.club.name || 'Câu lạc bộ chưa xác định'}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <CalendarOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Date: </Text>
                                <Text>{selectedDate.toLocaleDateString()}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Time: </Text>
                                <Text>{`${formatTime(selectedRoom.startTime)} - ${formatTime(selectedRoom.endTime)}`}</Text>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <TeamOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Available Seats: </Text>
                                <Text>{selectedRoom.availableSeats}/{selectedRoom.capacity}</Text>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <UserOutlined style={{ color: '#1890ff' }} />
                                <Text strong>Trainer: </Text>
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