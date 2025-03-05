import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Typography, notification, Spin } from 'antd';
import { getAllBookingRoom } from '../../../serviceToken/BookingMain';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import '../../../assets/css/Admin/BookingManage.css';
const { Title } = Typography;

function BookingManage() {
    const [bookingRoom, setBookingRoom] = useState([]);
    const [loading, setLoading] = useState(false);
    const tokenData = getTokenData(); // tokenData.access_token

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const response = await getAllBookingRoom(tokenData.access_token);
            console.log("response: ", response);
            if (response && response.data) {
                setBookingRoom(response.data);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch booking data.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    // ✅ Cấu hình các cột cho bảng
    const columns = [
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Room',
            dataIndex: 'roomName',
            key: 'roomName',
            filters: [...new Set(bookingRoom.map(item => item.roomName))].map(room => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.roomName === value,
        },
        {
            title: 'Booking Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            render: (dateArray) => new Date(...dateArray).toLocaleString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'CONFIRMED' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'QR Code Status',
            dataIndex: 'qrCode',
            key: 'qrCodeStatus',
            filters: [
                { text: 'VALID', value: 'VALID' },
                { text: 'USED', value: 'USED' },
            ],
            onFilter: (value, record) => record.qrCode?.qrCodeStatus === value,
            render: (qrCode) =>
                qrCode?.qrCodeStatus ? (
                    <Tag color={qrCode.qrCodeStatus === 'VALID' ? 'blue' : 'red'}>
                        {qrCode.qrCodeStatus}
                    </Tag>
                ) : (
                    'No QR Code'
                ),
        },
    ];

    return (
        <div className="booking-container">
            <Title level={2} className="title">Booking Management</Title>
            <Card className="booking-card">
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={bookingRoom}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        className="custom-table"
                    />
                )}
            </Card>
        </div>
    );
}

export default BookingManage;
