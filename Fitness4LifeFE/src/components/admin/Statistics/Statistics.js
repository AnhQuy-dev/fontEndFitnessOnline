import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Select, Row, Col, Statistic, Slider, Space, Button, DatePicker, Typography, Tabs } from "antd";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchPaymentStatistics } from "../../../serviceToken/StaticsticsSERVICE";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import TopPackagesStatistics from "./TopPackagesStatistics";
import BookingStatistics from "./BookingStatistics";
import { fetchAllRooms } from "../../../serviceToken/RoomSERVICE";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { TabPane } = Tabs;
const tokenData = getTokenData();//tokenData.access_token



const StatisticsPage = () => {
  const [dataByMonth, setDataByMonth] = useState([]);
  const [filteredMonthData, setFilteredMonthData] = useState([]);
  const [dataByDay, setDataByDay] = useState([]);
  const [filteredDayData, setFilteredDayData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthRange, setMonthRange] = useState([1, 12]); // Default: show all months
  const [dateRange, setDateRange] = useState(null); // For date range picker
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0); // Add state for total rooms
  const navigate = useNavigate();

  // Refs for scrolling to specific sections
  const dailyRevenueChartRef = useRef(null);

  const tokenData = getTokenData();

  // Function to scroll to the daily revenue chart
  const scrollToDailyRevenueChart = () => {
    if (dailyRevenueChartRef.current) {
      dailyRevenueChartRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to filter data by month range
  const filterDataByMonthRange = (data, range) => {
    return data.filter(item => item.month >= range[0] && item.month <= range[1]);
  };

  // Function to filter daily data by date range
  const filterDataByDateRange = (data, dateRange) => {
    if (!dateRange || dateRange.length !== 2) {
      // If no date range selected, show all data
      return data;
    }

    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    return data.filter(item => {
      return item.date >= startDate && item.date <= endDate;
    });
  };

  // Fetch statistics data and room data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Call API to get payment statistics
        const response = await fetchPaymentStatistics(tokenData.access_token);
        console.log("API Response:", response);

        // Call API to get all rooms
        const roomsResponse = await fetchAllRooms(tokenData.access_token);
        console.log("Rooms API Response:", roomsResponse);

        // Set total rooms count
        if (roomsResponse && roomsResponse.data) {
          setTotalRooms(roomsResponse.data.length);
        }

        if (response && response.data && response.data.data) {
          // API returns response.data.data as an array
          const orderData = response.data.data;
          console.log("Parsed data length:", orderData.length);

          // Set total orders count
          setTotalOrders(orderData.length);

          // Calculate total sales from all orders
          const totalSalesAmount = orderData.reduce((sum, order) => {
            const amount = typeof order.totalAmount === 'number'
              ? order.totalAmount
              : parseFloat(order.totalAmount || 0);
            return sum + amount;
          }, 0);

          setTotalSales(totalSalesAmount);

          processData(orderData);
        } else {
          console.error("Response data structure is not as expected", response);
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
    // Initialize data for 12 months
    const groupedByMonth = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      totalPurchases: 0,
      totalRevenue: 0,
    }));

    const groupedByDay = {};
    const uniqueYears = new Set();

    data.forEach((item) => {
      // Process startDate - is an array [year, month, day]
      let startDate;
      if (Array.isArray(item.startDate) && item.startDate.length >= 3) {
        // Format [year, month, day]
        startDate = new Date(item.startDate[0], item.startDate[1] - 1, item.startDate[2]);
      } else {
        // Fallback if not array format
        console.warn("Unexpected startDate format:", item.startDate);
        return; // Skip this item
      }

      const year = startDate.getFullYear();
      const month = startDate.getMonth(); // 0-11
      const day = startDate.getDate();

      uniqueYears.add(year);

      // Calculate by month
      if (year === selectedYear) {
        // Ensure totalAmount is a number
        const amount = typeof item.totalAmount === 'number'
          ? item.totalAmount
          : parseFloat(item.totalAmount || 0);

        groupedByMonth[month].totalPurchases += 1;
        groupedByMonth[month].totalRevenue += amount;
      }

      // Calculate by day
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

    // Filter daily data by selected year
    const yearFilteredDayData = Object.values(groupedByDay).filter(item => {
      const [year] = item.date.split('-');
      return parseInt(year) === selectedYear;
    });

    console.log("Monthly data:", groupedByMonth);
    console.log("Daily data:", yearFilteredDayData);

    setDataByMonth(groupedByMonth);
    setDataByDay(yearFilteredDayData);
    setFilteredDayData(yearFilteredDayData); // Initially show all days

    // Apply current filters
    setFilteredMonthData(filterDataByMonthRange(groupedByMonth, monthRange));

    setYears([...uniqueYears].sort((a, b) => b - a));
  };

  // Handle month range change for monthly chart
  const handleMonthRangeChange = (newRange) => {
    setMonthRange(newRange);
    setFilteredMonthData(filterDataByMonthRange(dataByMonth, newRange));
  };

  // Reset month range to show all months
  const resetMonthRange = () => {
    setMonthRange([1, 12]);
    setFilteredMonthData(filterDataByMonthRange(dataByMonth, [1, 12]));
  };

  // Handle date range change for daily chart
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setFilteredDayData(filterDataByDateRange(dataByDay, dates));
  };

  // Reset date filter to show all days
  const resetDateFilter = () => {
    setDateRange(null);
    setFilteredDayData(dataByDay); // Reset to show all data
  };

  // Get month ranges for presets (for each month)
  const getMonthRanges = () => {
    const ranges = {};

    // Add each month as a preset
    months.forEach(month => {
      ranges[month.label] = [
        dayjs().year(selectedYear).month(month.value - 1).startOf('month'),
        dayjs().year(selectedYear).month(month.value - 1).endOf('month')
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

  // Handle selected year change
  useEffect(() => {
    // Refresh data when year changes
    const refreshData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPaymentStatistics(tokenData.access_token);
        if (response && response.data && response.data.data) {
          // Update total orders when year changes
          setTotalOrders(response.data.data.length);

          // Calculate total sales when year changes
          const totalSalesAmount = response.data.data.reduce((sum, order) => {
            const amount = typeof order.totalAmount === 'number'
              ? order.totalAmount
              : parseFloat(order.totalAmount || 0);
            return sum + amount;
          }, 0);

          setTotalSales(totalSalesAmount);

          processData(response.data.data);
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    refreshData();
    // Reset date range when year changes
    setDateRange(null);
  }, [selectedYear]);

  // Generate marks for the slider
  const marks = {};
  for (let i = 1; i <= 12; i++) {
    marks[i] = i;
  }

  // Month names for presets
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

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
      <ul className="insights">
        <li onClick={() => navigate("/admin/orders")}>
          <i className='bx bx-calendar-check'></i>
          <span className="info">
            <h3>{isLoading ? 'Loading...' : totalOrders.toLocaleString()}</h3>
            <p>Paid Order</p>
          </span>
        </li>

        <li onClick={() => navigate("/admin/room")}>
          <i className='bx bx-building-house'></i>
          <span className="info">
            <h3>{isLoading ? 'Loading...' : totalRooms.toLocaleString()}</h3>
            <p>Room</p>
          </span>
        </li>

        <li onClick={scrollToDailyRevenueChart} style={{ cursor: 'pointer' }}>
          <i className='bx bx-dollar-circle'></i>
          <span className="info">
            <h3>{isLoading ? 'Loading...' : `$${totalSales.toLocaleString()}`}</h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      {/* Statistics Tab System */}
      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        <TabPane tab="Revenue Statistics" key="1">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {/* Monthly chart with filter */}
              <Card
                title={`Purchases & Revenue by Month in ${selectedYear}`}
                style={{ marginTop: 20 }}
                extra={
                  <Button type="primary" onClick={resetMonthRange} size="small">
                    Reset Filter
                  </Button>
                }
              >
                {/* Month range slider */}
                <div style={{ margin: '20px 10px 30px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <h4>Filter Months: {monthRange[0]} to {monthRange[1]}</h4>
                    <Slider
                      range
                      min={1}
                      max={12}
                      marks={marks}
                      value={monthRange}
                      onChange={handleMonthRangeChange}
                      tooltip={{
                        formatter: value => `Month ${value}`
                      }}
                    />
                  </Space>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={filteredMonthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={(tick) => `Tháng ${tick}`} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value) => value.toLocaleString('en-US')} />
                    <Legend />
                    <Bar dataKey="totalPurchases" fill="#8884d8" name="Buys" yAxisId="left" />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" name="Turnover (USD)" yAxisId="right" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Daily chart with date range filter */}
              <Card
                ref={dailyRevenueChartRef} // Add ref to this card
                title={`Purchases & Revenue by Day in ${selectedYear}`}
                style={{ marginTop: 20 }}
                extra={
                  <Button type="primary" onClick={resetDateFilter} size="small">
                    Reset Date Filter
                  </Button>
                }
                id="daily-revenue-chart" // Add an ID for easier access
              >
                <div style={{ margin: '0 0 20px' }}>
                  <Row gutter={16} align="middle">
                    <Col xs={24}>
                      <Title level={5}>Date Range:</Title>
                      <RangePicker
                        style={{ width: '100%' }}
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="YYYY-MM-DD"
                        placeholder={['Start Date', 'End Date']}
                        allowClear={true}
                        ranges={getMonthRanges()}
                      />
                    </Col>
                  </Row>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={filteredDayData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value) => value.toLocaleString('en-US')} />
                    <Legend />
                    <Bar dataKey="totalPurchases" fill="#8884d8" name="Buys" yAxisId="left" />
                    <Bar dataKey="totalRevenue" fill="#82ca9d" name="Turnover (USD)" yAxisId="right" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </TabPane>

        <TabPane tab="Package Statistics" key="2">
          <TopPackagesStatistics />
        </TabPane>

        <TabPane tab="Booking Statistics" key="3">
          <BookingStatistics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;

