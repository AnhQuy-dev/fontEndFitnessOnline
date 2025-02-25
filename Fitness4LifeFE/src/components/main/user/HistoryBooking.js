import React, { useState, useEffect } from 'react';
import { fetchAllBookingHistoryByUserId, getQrCode } from '../../../services/BookingRoomService';
import { Card, Empty } from 'antd';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';

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
            console.log("dataDAta: ", data);
            setBookingHistory(Array.isArray(data) ? data : data.data || []);



            // Fetch QR codes for each booking
            data.forEach(async (booking) => {
                try {
                    const qrData = await getQrCode(booking.id, tokenData.access_token);
                    console.log("qrData: ", qrData);

                    setQrCodes(prev => ({
                        ...prev,
                        [booking.id]: qrData
                    }));
                } catch (error) {
                    console.error(`Error fetching QR code for booking ${booking.id}:`, error);
                }
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookingHistory();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    // Show message when no booking history exists
    if (!bookingHistory || bookingHistory.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Empty
                    description={
                        <div>
                            <h2 className="text-xl font-semibold text-gray-600">No Booking History</h2>
                            <p className="text-gray-500 mt-2">You haven't made any bookings yet.</p>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <section id="services">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Booking History</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookingHistory.map((booking) => (
                        <Card key={booking.id} className="shadow-lg">
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">Booking #{booking.id}</h2>
                                <div className="space-y-2">
                                    <p>Room: {booking.roomName}</p>
                                    <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                    <p>Status: {booking.status}</p>
                                    {qrCodes[booking.id] && (
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">QR Code</h3>
                                            <img
                                                src={qrCodes[booking.id].qrCodeUrl}
                                                alt={`QR Code for booking ${booking.id}`}
                                                className="w-32 h-32 mx-auto"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookingHistoryPage;