import React, { useEffect, useState, useContext } from 'react';
import { Card, Modal, Button, notification, Layout, Typography, Spin } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../helpers/DataContext';
import { GetRoomsByPackage, submitBookingRoom } from '../../../services/PackageService';
import stickman from '../../../assets/images/Stickman.gif';
import { jwtDecode } from 'jwt-decode';
import { getUserByEmail } from '../../../serviceToken/authService';

const { Content } = Layout;
const { Title, Text } = Typography;

const BookingMain = () => {
    const { user, isLoggedIn } = useContext(DataContext);
    const navigate = useNavigate();
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const tokenData = localStorage.getItem("tokenData");
    const { access_token } = JSON.parse(tokenData);

    useEffect(() => {
        const loadRoomsByPackage = async () => {
            try {
                const decodeuser = jwtDecode(access_token);
                const user = await getUserByEmail(decodeuser.sub,access_token);
                console.log("user",user);

                
                const rooms = await GetRoomsByPackage(user?.workoutPackageId);
                setFilteredRooms(rooms);
            } catch (error) {
                notification.error({
                    message: 'Lỗi tải dữ liệu phòng',
                    description: error.message || 'Có lỗi xảy ra khi tải danh sách phòng.',
                });
            } finally {
                setLoading(false);
            }
        };

        if (user?.workoutPackageId) {
            loadRoomsByPackage();
        }

        // Dừng loading sau 5 giây nếu chưa tải xong
        const timeout = setTimeout(() => setLoading(false), 5000);

        return () => clearTimeout(timeout);
    }, [user]);

    const openModal = (room) => {
        if (!isLoggedIn) {
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
            userId: user.id,
            roomId: selectedRoom.id,
        };

        try {
            const response = await submitBookingRoom(bookingData);
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

    return (
        <section id="services">
            <Layout className="min-h-screen" style={{ background: '#f5f5f5' }}>
                <Content style={{ padding: '16px' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                                    style={{ marginBottom: '16px' }}
                                    bodyStyle={{ padding: '16px' }}
                                    hoverable
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <Title level={4} style={{ marginBottom: '16px' }}>{room.roomName}</Title>

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
                                        style={{ marginTop: '16px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(room);
                                        }}
                                    >
                                        Đặt lịch
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>

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
                                    <Text strong>Ngày: </Text>
                                    <Text>{selectedDate.toLocaleDateString()}</Text>
                                </div>
                                <div>
                                    <Text strong>Thời gian: </Text>
                                    <Text>{`${selectedRoom.startTime[0]}:${selectedRoom.startTime[1]} - ${selectedRoom.endTime[0]}:${selectedRoom.endTime[1]}`}</Text>
                                </div>
                                <div>
                                    <Text strong>Số chỗ trống: </Text>
                                    <Text>{selectedRoom.availableSeats}/{selectedRoom.capacity}</Text>
                                </div>
                                <div>
                                    <Text strong>Tiện nghi: </Text>
                                    <Text>{selectedRoom.facilities}</Text>
                                </div>
                            </div>
                        )}
                    </Modal>
                </Content>
            </Layout>
        </section>
    );
};

export default BookingMain;
