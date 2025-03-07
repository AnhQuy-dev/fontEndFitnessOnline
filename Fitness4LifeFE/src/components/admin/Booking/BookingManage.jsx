import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Typography, notification, Spin } from "antd";
import { getAllBookingRoom } from "../../../serviceToken/BookingMain";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import "../../../assets/css/Admin/BookingManage.css";
import { getRoomById } from "../../../serviceToken/StaticsticsSERVICE";

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
                let processedData = response.data;

                // 🔥 Lọc roomId tránh trùng lặp
                const roomIds = [...new Set(processedData.map(booking => booking.roomId))];

                // ✅ Gửi request lấy thông tin phòng
                const roomsData = await Promise.all(
                    roomIds.map(roomId => getRoomById(roomId, tokenData.access_token))
                );

                // ✅ Tạo Map để dễ truy xuất phòng theo id
                const roomsMap = new Map(roomsData.map(room => [room.id, room]));

                // ✅ Cập nhật dữ liệu phòng vào `bookingRoom`
                const updatedData = processedData.map(booking => {
                    const matchingRoom = roomsMap.get(booking.roomId);
                    return {
                        ...booking,
                        startTime: matchingRoom ? matchingRoom.startTime : "N/A",
                        endTime: matchingRoom ? matchingRoom.endTime : "N/A",
                    };
                });

                setBookingRoom(updatedData);
            } else {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch booking data.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    // console.log("bookingRoom: ", bookingRoom);
    const formatTime = (timeArray) => {
        if (!timeArray || !Array.isArray(timeArray) || timeArray.length < 2) {
            return 'N/A';
        }

        // Get hours and minutes from the array
        let hours = timeArray[0];
        const minutes = timeArray[1];

        // Format as HH:MM with leading zeros
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const formatBookingDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
            return 'N/A';
        }

        // Lấy từng phần của ngày
        const [year, month, day, hour, minute, second] = dateArray;

        // Chuyển tháng từ 0-based (JS) sang 1-based (thực tế)
        const formattedDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        fetchBooking();
    }, []);

    // ✅ Cấu hình các cột cho bảng
    const columns = [
        {
            title: "User",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Room",
            dataIndex: "roomName",
            key: "roomName",
            filters: [...new Set(bookingRoom.map(item => item.roomName))].map(room => ({
                text: room,
                value: room,
            })),
            onFilter: (value, record) => record.roomName === value,
        },
        {
            title: "Booking Date",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (dateArray) => formatBookingDate(dateArray),
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            filters: [...new Set(bookingRoom.map(item => formatTime(item.startTime)))].map(time => ({
                text: time,
                value: time,
            })),
            onFilter: (value, record) => formatTime(record.startTime) === value,
            render: (value) => formatTime(value),
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            filters: [...new Set(bookingRoom.map(item => formatTime(item.endTime)))].map(time => ({
                text: time,
                value: time,
            })),
            onFilter: (value, record) => formatTime(record.endTime) === value,
            render: (value) => formatTime(value),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "CONFIRMED" ? "green" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "QR Code Status",
            dataIndex: "qrCode",
            key: "qrCodeStatus",
            filters: [
                { text: "VALID", value: "VALID" },
                { text: "USED", value: "USED" },
            ],
            onFilter: (value, record) => record.qrCode?.qrCodeStatus === value,
            render: (qrCode) =>
                qrCode?.qrCodeStatus ? (
                    <Tag color={qrCode.qrCodeStatus === "VALID" ? "blue" : "red"}>
                        {qrCode.qrCodeStatus}
                    </Tag>
                ) : (
                    "No QR Code"
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
