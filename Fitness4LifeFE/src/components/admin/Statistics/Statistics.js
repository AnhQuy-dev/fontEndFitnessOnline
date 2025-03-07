import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Select, Table, Row, Col, Statistic } from "antd";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchPaymentStatistics, GetAllBookings, getRoomById } from "../../../serviceToken/StaticsticsSERVICE";
import { TrophyOutlined } from '@ant-design/icons';

const StatisticsPage = () => {
  const [dataByMonth, setDataByMonth] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topRooms, setTopRooms] = useState([]);
  const [top3Rooms, setTop3Rooms] = useState([]);
  const [restRooms, setRestRooms] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const tokenData = getTokenData();

  // Xử lý dữ liệu bookings để tìm top 10 phòng
  const processBookingsData = (data) => {
    // Đếm số lần mỗi phòng được đặt
    const roomCounts = {};

    data.forEach(booking => {
      const roomName = booking.roomName;
      if (!roomCounts[roomName]) {
        roomCounts[roomName] = {
          roomId: booking.roomId,
          roomName: roomName,
          count: 0
        };
      }
      roomCounts[roomName].count += 1;
    });

    // Chuyển đổi thành mảng và sắp xếp
    const sortedRooms = Object.values(roomCounts)
      .sort((a, b) => b.count - a.count)
      .map((room, index) => ({
        key: room.roomId,
        rank: index + 1,
        roomName: room.roomName,
        bookingCount: room.count
      }));

    // Chia thành top 3 và phần còn lại (top 4-10)
    const top3 = sortedRooms.slice(0, 3);
    const rest = sortedRooms.slice(3, 10);

    return {
      all: sortedRooms.slice(0, 10), // Top 10
      top3,
      rest
    };
  };

  // Lấy dữ liệu bookings
  useEffect(() => {
    const getBookingsData = async () => {
      try {
        setBookingsLoading(true);
        const bookingsResponse = await GetAllBookings(tokenData.access_token);
        if (bookingsResponse && bookingsResponse.data && bookingsResponse.data.data) {
          const processedData = processBookingsData(bookingsResponse.data.data);
          const roomIds = bookingsResponse.data.data.map(booking => booking.roomId);
          const roomsData = await Promise.all(roomIds.map(roomId => getRoomById(roomId, tokenData.access_token)));
          const roomsMap = new Map(roomsData.map(room => [room.id, room]));
          if (roomsMap.has(undefined)) {
            console.warn("⚠️ Warning: roomsMap chứa giá trị lỗi", roomsMap.get(undefined));
          }
          // Ánh xạ lại dữ liệu, sử dụng room.key thay vì room.roomId
          processedData.all = processedData.all.map(room => {
            const matchingRoom = roomsMap.get(room.key); // Sửa `room.roomId` thành `room.key`
            if (matchingRoom) {
              return {
                ...room,
                startTime: matchingRoom.startTime,
                endTime: matchingRoom.endTime,
              };
            } else {
              console.warn(`❌ No matching room found for roomId ${room.key}`);
            }
            return { ...room, startTime: "N/A", endTime: "N/A" }; // Tránh lỗi undefined
          });
          setTopRooms(processedData.all);
          setTop3Rooms(processedData.top3);
          setRestRooms(processedData.rest);
        }
      } catch (error) {
        console.error("Error processing bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    getBookingsData();
  }, [tokenData.access_token]);


  console.log("topRooms: ", topRooms);

  // Lấy dữ liệu thanh toán
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Gọi API để lấy dữ liệu
        const response = await fetchPaymentStatistics(tokenData.access_token);
        // console.log("API Response:", response);

        if (response && response.data && response.data.data) {
          // API trả về response.data.data là một mảng
          const orderData = response.data.data;
          // console.log("Parsed data length:", orderData.length);
          processData(orderData);
        } else {
          // console.error("Response data structure is not as expected", response);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tokenData.access_token]);

  const processData = (data) => {
    // Khởi tạo dữ liệu cho 12 tháng
    const groupedByMonth = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      totalPurchases: 0,
      totalRevenue: 0,
    }));

    const groupedByDay = {};
    const uniqueYears = new Set();

    data.forEach((item) => {
      // Xử lý startDate - là mảng [year, month, day]
      let startDate;
      if (Array.isArray(item.startDate) && item.startDate.length >= 3) {
        // Định dạng [year, month, day]
        startDate = new Date(item.startDate[0], item.startDate[1] - 1, item.startDate[2]);
      } else {
        // Fallback nếu không phải định dạng mảng
        console.warn("Unexpected startDate format:", item.startDate);
        return; // Bỏ qua item này
      }

      const year = startDate.getFullYear();
      const month = startDate.getMonth(); // 0-11
      const day = startDate.getDate();

      uniqueYears.add(year);

      // Tính toán theo tháng
      if (year === selectedYear) {
        // Đảm bảo totalAmount là số
        const amount = typeof item.totalAmount === 'number'
          ? item.totalAmount
          : parseFloat(item.totalAmount || 0);

        groupedByMonth[month].totalPurchases += 1;
        groupedByMonth[month].totalRevenue += amount;
      }

      // Tính toán theo ngày
      const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = { date: dayKey, totalPurchases: 0, totalRevenue: 0 };
      }

      const amount = typeof item.totalAmount === 'number'
        ? item.totalAmount
        : parseFloat(item.totalAmount || 0);

      groupedByDay[dayKey].totalPurchases += 1;
      groupedByDay[dayKey].totalRevenue += amount;
    });

    // Lọc dữ liệu ngày theo năm được chọn
    const filteredDayData = Object.values(groupedByDay).filter(item => {
      const [year] = item.date.split('-');
      return parseInt(year) === selectedYear;
    });

    // console.log("Monthly data:", groupedByMonth);
    // console.log("Daily data:", filteredDayData);

    setDataByMonth(groupedByMonth);
    setDataByDay(filteredDayData);
    setYears([...uniqueYears].sort((a, b) => b - a));
  };

  // Xử lý khi selectedYear thay đổi
  useEffect(() => {
    // Gọi lại API khi năm thay đổi để refresh dữ liệu
    const refreshData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPaymentStatistics(tokenData.access_token);
        if (response && response.data && response.data.data) {
          processData(response.data.data);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    refreshData();
  }, [selectedYear]);

  // Định nghĩa cột cho bảng Top Rooms (4-10)
  const topRoomsColumns = [
    {
      title: 'Thứ hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Số lần đặt phòng',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      sorter: (a, b) => a.bookingCount - b.bookingCount,
      sortDirections: ['descend', 'ascend'],
    }
  ];

  // Lấy các màu tương ứng với xếp hạng
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return '#1890ff'; // Default blue
    }
  };

  // Tạo top 3 rooms
  const renderTop3 = () => {
    if (bookingsLoading || top3Rooms.length === 0) {
      return <div>Đang tải dữ liệu...</div>;
    }

    return (
      <div style={{ padding: '20px 0' }}>
        {/* Top 1 - Hàng đầu */}
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={18} md={12} lg={8}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                backgroundColor: '#FFFDF0',
                borderColor: getRankColor(1),
                borderWidth: '2px'
              }}
            >
              <TrophyOutlined style={{ fontSize: '32px', color: getRankColor(1), marginBottom: '8px' }} />
              <h2 style={{ margin: '0', fontSize: '24px', color: getRankColor(1) }}>Top 1</h2>
              <h3 style={{ fontSize: '20px', margin: '12px 0' }}>{top3Rooms[0]?.roomName}</h3>
              <Statistic
                value={top3Rooms[0]?.bookingCount}
                suffix="lượt đặt phòng"
                valueStyle={{ color: '#1890ff', fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Top 2 và 3 - Hàng thứ hai */}
        <Row gutter={16} justify="center">
          {top3Rooms.slice(1, 3).map((room, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.key}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  backgroundColor: '#FAFAFA',
                  borderColor: getRankColor(room.rank),
                  borderWidth: '2px'
                }}
              >
                <TrophyOutlined style={{ fontSize: '24px', color: getRankColor(room.rank), marginBottom: '8px' }} />
                <h3 style={{ margin: '0', fontSize: '18px', color: getRankColor(room.rank) }}>Top {room.rank}</h3>
                <h4 style={{ fontSize: '16px', margin: '8px 0' }}>{room.roomName}</h4>
                <Statistic
                  value={room.bookingCount}
                  suffix="lượt đặt"
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div>
      <h2>Statistics</h2>
      <Select
        value={selectedYear}
        onChange={setSelectedYear}
        style={{ width: 120, marginBottom: 20 }}
        disabled={isLoading || years.length === 0}
      >
        {years.map((year) => (
          <Select.Option key={year} value={year}>{year}</Select.Option>
        ))}
      </Select>

      {/* Top 3 phòng được đặt nhiều nhất */}
      <Card
        title={<h3 style={{ textAlign: 'center' }}>Top 3 phòng được đặt nhiều nhất</h3>}
        style={{ marginTop: 20 }}
        loading={bookingsLoading}
        bordered={false}
      >
        {renderTop3()}
      </Card>

      {/* Bảng xếp hạng từ Top 4 đến Top 10 */}
      <Card
        title="Xếp hạng Top 4 - 10 phòng được đặt nhiều nhất"
        style={{ marginTop: 20 }}
        loading={bookingsLoading}
      >
        <Table
          columns={topRoomsColumns}
          dataSource={restRooms}
          pagination={false}
          loading={bookingsLoading}
        />
      </Card>

      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <>
          <Card title={`Purchases & Revenue by Month in ${selectedYear}`} style={{ marginTop: 20 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dataByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={(tick) => `Tháng ${tick}`} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value) => value.toLocaleString('vi-VN')} />
                <Legend />
                <Bar dataKey="totalPurchases" fill="#8884d8" name="Lượt Mua" yAxisId="left" />
                <Bar dataKey="totalRevenue" fill="#82ca9d" name="Doanh Thu (VND)" yAxisId="right" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title={`Purchases & Revenue by Day in ${selectedYear}`} style={{ marginTop: 20 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dataByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value) => value.toLocaleString('vi-VN')} />
                <Legend />
                <Bar dataKey="totalPurchases" fill="#8884d8" name="Lượt Mua" yAxisId="left" />
                <Bar dataKey="totalRevenue" fill="#82ca9d" name="Doanh Thu (VND)" yAxisId="right" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;