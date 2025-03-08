import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Space } from 'antd';
import { TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { getTokenData } from "../../../serviceToken/tokenUtils";
import dayjs from 'dayjs';
import { GetAllBookings, getRoomById } from '../../../serviceToken/StaticsticsSERVICE';

const { RangePicker } = DatePicker;

const BookingStatistics = () => {
  const [topRooms, setTopRooms] = useState([]);
  const [top3Rooms, setTop3Rooms] = useState([]);
  const [restRooms, setRestRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bookingByTimeSlot, setBookingByTimeSlot] = useState([]);

  const tokenData = getTokenData();

  // Process bookings data function
  const processBookingsData = (bookingData) => {
    // Create a map to count bookings by roomId
    const roomBookingCounts = new Map();

    // Count bookings per room
    bookingData.forEach(booking => {
      const roomId = booking.roomId;
      if (roomId) {
        const currentCount = roomBookingCounts.get(roomId) || 0;
        roomBookingCounts.set(roomId, currentCount + 1);
      }
    });

    // Convert the map to an array of room objects with booking counts
    const roomsWithBookings = Array.from(roomBookingCounts.entries()).map(([roomId, bookingCount]) => {
      return {
        key: roomId,
        roomId: roomId,
        bookingCount: bookingCount,
        // Estimate revenue based on booking count (will be updated with actual room data later)
        estimatedRevenue: bookingCount * (Math.floor(Math.random() * 50) + 150) * 1000
      };
    });

    // Sort rooms by booking count in descending order
    const sortedRooms = roomsWithBookings.sort((a, b) => b.bookingCount - a.bookingCount)
      .map((room, index) => ({
        ...room,
        rank: index + 1
      }));

    // Calculate total bookings
    const totalBookingCount = sortedRooms.reduce((sum, room) => sum + room.bookingCount, 0);

    // Divide into top 3 and the rest (top 4-10)
    const top3 = sortedRooms.slice(0, 3);
    const rest = sortedRooms.slice(3, 10);

    return {
      all: sortedRooms.slice(0, 10), // Top 10
      top3,
      rest,
      totalBookings: totalBookingCount
    };
  };

  // Process time slot data after room details are available
  const processTimeSlotData = (roomsData) => {
    // Create time slot statistics
    const timeSlots = [
      { name: "Morning (6AM-9AM)", count: 0, revenue: 0 },
      { name: "Midday (9AM-12PM)", count: 0, revenue: 0 },
      { name: "Afternoon (12PM-5PM)", count: 0, revenue: 0 },
      { name: "Evening (5PM-9PM)", count: 0, revenue: 0 },
      { name: "Night (9PM-12AM)", count: 0, revenue: 0 }
    ];

    // Group bookings by time slot
    roomsData.forEach(room => {
      if (room.startTime && Array.isArray(room.startTime)) {
        const hour = room.startTime[0];
        let slotIndex;

        if (hour >= 6 && hour < 9) slotIndex = 0;
        else if (hour >= 9 && hour < 12) slotIndex = 1;
        else if (hour >= 12 && hour < 17) slotIndex = 2;
        else if (hour >= 17 && hour < 21) slotIndex = 3;
        else slotIndex = 4;

        timeSlots[slotIndex].count += room.bookingCount;
        timeSlots[slotIndex].revenue += room.estimatedRevenue;
      }
    });

    // Sort time slots by booking count
    return timeSlots.sort((a, b) => b.count - a.count);
  };

  // Fetch bookings data
  const getBookingsData = async () => {
    try {
      setBookingsLoading(true);
      const bookingsResponse = await GetAllBookings(tokenData.access_token);

      if (bookingsResponse && bookingsResponse.data && bookingsResponse.data.data) {
        // Process booking data to get counts per room
        const processedData = processBookingsData(bookingsResponse.data.data);

        // Get all unique room IDs from bookings
        const roomIds = [...new Set(bookingsResponse.data.data.map(booking => booking.roomId))];

        // Fetch details for each room
        const roomsData = await Promise.all(
          roomIds.map(roomId => getRoomById(roomId, tokenData.access_token))
        );

        // Create a map of room details by ID
        const roomsMap = new Map();
        roomsData.forEach(room => {
          if (room && room.id) {
            roomsMap.set(room.id, room);
          }
        });

        // Merge room details with booking data
        const enrichedRooms = processedData.all.map(room => {
          const roomDetails = roomsMap.get(room.key);

          if (roomDetails) {
            const formattedStartTime = roomDetails.startTime && Array.isArray(roomDetails.startTime) ?
              `${String(roomDetails.startTime[0]).padStart(2, '0')}:${String(roomDetails.startTime[1]).padStart(2, '0')}` :
              "N/A";

            const formattedEndTime = roomDetails.endTime && Array.isArray(roomDetails.endTime) ?
              `${String(roomDetails.endTime[0]).padStart(2, '0')}:${String(roomDetails.endTime[1]).padStart(2, '0')}` :
              "N/A";

            const startTimeValue = roomDetails.startTime && Array.isArray(roomDetails.startTime) ?
              (roomDetails.startTime[0] * 60) + roomDetails.startTime[1] :
              0;

            return {
              ...room,
              roomName: roomDetails.roomName || `Room ${room.key}`,
              startTimeRaw: roomDetails.startTime,
              startTime: formattedStartTime,
              endTime: formattedEndTime,
              startTimeValue: startTimeValue
            };
          } else {
            console.warn(`❌ No matching room found for roomId ${room.key}`);
            return {
              ...room,
              roomName: `Room ${room.key}`,
              startTime: "N/A",
              endTime: "N/A",
              startTimeValue: 0
            };
          }
        });

        // Calculate time slot statistics based on enriched room data
        const timeSlotData = processTimeSlotData(enrichedRooms);

        // Update states with the processed data
        setTopRooms(enrichedRooms);
        setTop3Rooms(enrichedRooms.slice(0, 3));
        setRestRooms(enrichedRooms.slice(3, 10));
        setTotalBookings(processedData.totalBookings);
        setBookingByTimeSlot(timeSlotData);
      }
    } catch (error) {
      console.error("Error processing bookings:", error);
    } finally {
      setBookingsLoading(false);
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getBookingsData();
  }, [tokenData.access_token]);

  // Function to handle date range filter
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // In a real app, you would filter the booking data by date here
    // For now, we'll just keep the existing data
  };

  // Reset date filter
  const resetDateFilter = () => {
    setDateRange(null);
    // Reload the original data
    getBookingsData();
  };

  // Get rank colors
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return '#1890ff'; // Default blue
    }
  };

  // Top rooms columns
  const topRoomsColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Room name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: (a, b) => a.startTimeValue - b.startTimeValue,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Bookings',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      sorter: (a, b) => b.bookingCount - a.bookingCount,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      render: (count) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Estimated Revenue',
      dataIndex: 'estimatedRevenue',
      key: 'estimatedRevenue',
      sorter: (a, b) => b.estimatedRevenue - a.estimatedRevenue,
      render: (value) => <span>${value.toLocaleString()}</span>
    }
  ];

  // Time slot columns
  const timeSlotColumns = [
    {
      title: 'Time Slot',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Booking Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => b.count - a.count,
      defaultSortOrder: 'descend',
      render: (count) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => b.revenue - a.revenue,
      render: (value) => <span>${value.toLocaleString()}</span>
    }
  ];

  // Render top 3 rooms
  const renderTop3 = () => {
    if (isLoading || top3Rooms.length === 0) {
      return <div>Loading...</div>;
    }

    return (
      <div style={{ padding: '20px 0' }}>
        {/* Top 1 - First row */}
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
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Statistic
                  title="Start Time"
                  value={top3Rooms[0]?.startTime}
                  valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                />
                <Statistic
                  title="End Time"
                  value={top3Rooms[0]?.endTime}
                  valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                />
              </div>
              <Statistic
                title="Bookings"
                value={top3Rooms[0]?.bookingCount}
                valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
              />
              <Statistic
                title="Revenue"
                value={`$${top3Rooms[0]?.estimatedRevenue.toLocaleString()}`}
                valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Top 2 and 3 - Second row */}
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
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '8px' }}>
                  <Statistic
                    title="Start Time"
                    value={room.startTime}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  />
                  <Statistic
                    title="End Time"
                    value={room.endTime}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  />
                </div>
                <Statistic
                  title="Bookings"
                  value={room.bookingCount}
                  valueStyle={{ color: '#ff4d4f', fontSize: '16px' }}
                />
                <Statistic
                  title="Revenue"
                  value={`$${room.estimatedRevenue.toLocaleString()}`}
                  valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // Get month ranges for presets (for date picker)
  const getDateRanges = () => {
    const ranges = {};
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    // Add each month as a preset
    months.forEach((month, index) => {
      ranges[month] = [
        dayjs().year(selectedYear).month(index).startOf('month'),
        dayjs().year(selectedYear).month(index).endOf('month')
      ];
    });

    // Add some common date ranges
    ranges['Current Month'] = [
      dayjs().startOf('month'),
      dayjs().endOf('month')
    ];

    ranges['Previous Month'] = [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month')
    ];

    ranges['Last 30 Days'] = [
      dayjs().subtract(29, 'day'),
      dayjs()
    ];

    return ranges;
  };

  return (
    <div>
      <h2>Booking Statistics</h2>

      {/* Summary statistics */}
      <Card
        title="Booking Overview"
        style={{ marginBottom: 20 }}
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              placeholder={['Start Date', 'End Date']}
              allowClear={true}
              ranges={getDateRanges()}
            />
            <Button type="primary" onClick={resetDateFilter} size="small">
              Reset Filter
            </Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Total Bookings"
              value={totalBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Peak Booking Time"
              value={bookingByTimeSlot[0]?.name || 'Loading...'}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Estimated Total Revenue"
              value={`$${topRooms.reduce((sum, room) => sum + room.estimatedRevenue, 0).toLocaleString()}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Bookings by time slot */}
      <Card
        title="Bookings by Time Slot"
        style={{ marginBottom: 20 }}
        loading={isLoading}
      >
        <Table
          columns={timeSlotColumns}
          dataSource={bookingByTimeSlot}
          pagination={false}
          loading={isLoading}
        />
      </Card>

      {/* Top 3 rooms based on booking count */}
      <Card
        title={<h3 style={{ textAlign: 'center' }}>Top 3 Most Booked Rooms</h3>}
        style={{ marginTop: 20 }}
        loading={isLoading}
        bordered={false}
      >
        {renderTop3()}
      </Card>

      {/* Top 4 - 10 ranking */}
      <Card
        title="Top 4 - 10 Most Booked Rooms"
        style={{ marginTop: 20 }}
        loading={isLoading}
      >
        <Table
          columns={topRoomsColumns}
          dataSource={restRooms}
          pagination={false}
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

export default BookingStatistics;