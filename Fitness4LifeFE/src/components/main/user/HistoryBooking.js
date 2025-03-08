import React, { useState, useEffect } from 'react';
import { Card, Empty, Spin, Alert, Tag, Typography, Row, Col, Badge, Divider } from 'antd';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';
import { CalendarOutlined, ClockCircleOutlined, NumberOutlined } from '@ant-design/icons';
import { fetchAllBookingHistoryByUserId, getQrCode } from '../../../serviceToken/BookingMain';

const { Title, Text } = Typography;

const BookingHistoryPage = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [qrCodes, setQrCodes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const tokenData = getTokenData();
    const decodedToken = getDecodedToken();

    const loadBookingHistory = async () => {
        try {
            const data = await fetchAllBookingHistoryByUserId(decodedToken.id, tokenData.access_token);
            console.log("Booking data:", data);
            setBookingHistory(Array.isArray(data) ? data : data.data || []);

            // Fetch QR codes for each booking
            const bookings = Array.isArray(data) ? data : data.data || [];
            bookings.forEach(async (booking) => {
                try {
                    const qrData = await getQrCode(booking.id, tokenData.access_token);
                    console.log("QR code data for booking", booking.id, ":", qrData);

                    setQrCodes(prev => ({
                        ...prev,
                        [booking.id]: qrData
                    }));
                } catch (error) {
                    console.error(`Error fetching QR code for booking ${booking.id}:`, error);
                }
            });
        } catch (error) {
            setError(error.message || "Unable to load booking history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookingHistory();
    }, []);

    const formatBookingDate = (dateArray) => {
        if (!Array.isArray(dateArray)) return "Invalid date";

        // dateArray format: [year, month, day, hour, minute, second, nanosecond]
        const [year, month, day, hour, minute] = dateArray;

        // Create date string
        const date = new Date(year, month - 1, day, hour, minute);

        // Format date
        const dateStr = date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        // Format time
        const timeStr = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            date: dateStr,
            time: timeStr
        };
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            'COMPLETED': { color: 'success', text: 'Completed' },
            'PENDING': { color: 'processing', text: 'Pending' },
            'CANCELLED': { color: 'error', text: 'Cancelled' },
            'default': { color: 'default', text: status }
        };

        const config = statusConfig[status] || statusConfig.default;
        return <Badge status={config.color} text={config.text} />;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert
                    type="error"
                    message="Error"
                    description={error}
                    showIcon
                />
            </div>
        );
    }

    if (!bookingHistory || bookingHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Empty
                    description={
                        <div>
                            <Title level={4}>No booking history</Title>
                            <Text type="secondary">You have not made any bookings yet.</Text>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <section id="services" className="pt-28 min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <Title level={2} className="text-center mb-6">
                    Booking History
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookingHistory.map((booking) => {
                        const bookingDateTime = formatBookingDate(booking.bookingDate);
                        return (
                            <Card
                                key={booking.id}
                                title={booking.roomName}
                                className="hover:shadow-xl transition-shadow duration-300"
                                headStyle={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#f0f7ff',
                                    borderBottom: '2px solid #e6f0ff'
                                }}
                                style={{ backgroundColor: '#fff' }}
                                extra={getStatusTag(booking.status)}
                            >
                                <div className="space-y-2">
                                    {qrCodes[booking.id] && (
                                        <div className="mt-3 text-center">
                                            <Title level={5} className="mb-1">Booking date: {bookingDateTime.date}</Title>
                                            <Title level={5} className="mb-2">Time slot: {bookingDateTime.time}</Title>
                                            <div className="p-3 bg-white rounded-lg shadow-inner inline-block">
                                                <img
                                                    src={qrCodes[booking.id].qrCodeUrl}
                                                    alt={`QR Code for booking ${booking.id}`}
                                                    className="w-28 h-28"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BookingHistoryPage;
