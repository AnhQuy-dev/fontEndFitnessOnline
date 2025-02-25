import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Select } from "antd";
import { fetchPaymentStatistics } from "../../../services/Payment";

const StatisticsPage = () => {
  const [dataByMonth, setDataByMonth] = useState([]);
  const [dataByDay, setDataByDay] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchPaymentStatistics().then((data) => {
      const groupedByMonth = Array(12).fill(0).map((_, index) => ({
        month: index + 1,
        totalPurchases: 0,
        totalRevenue: 0,
      }));

      const groupedByDay = {};
      const uniqueYears = new Set();

      data.forEach((item) => {
        const startDate = new Date(item.startDate[0], item.startDate[1] - 1, item.startDate[2]);
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        const day = startDate.getDate();

        uniqueYears.add(year);

        // Tính toán theo tháng
        if (year === selectedYear) {
          groupedByMonth[month].totalPurchases += 1;
          groupedByMonth[month].totalRevenue += item.totalAmount;
        }

        // Tính toán theo ngày
        const dayKey = `${year}-${month + 1}-${day}`;
        if (!groupedByDay[dayKey]) {
          groupedByDay[dayKey] = { date: dayKey, totalPurchases: 0, totalRevenue: 0 };
        }
        groupedByDay[dayKey].totalPurchases += 1;
        groupedByDay[dayKey].totalRevenue += item.totalAmount;
      });

      setDataByMonth(groupedByMonth);
      setDataByDay(Object.values(groupedByDay));
      setYears([...uniqueYears].sort((a, b) => b - a));
    });
  }, [selectedYear]);

  return (
    <div>
      <h2>Statistics</h2>
      <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120, marginBottom: 20 }}>
        {years.map((year) => (
          <Select.Option key={year} value={year}>{year}</Select.Option>
        ))}
      </Select>

      <Card title={`Purchases & Revenue by Month in ${selectedYear}`}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(tick) => `Tháng ${tick}`} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPurchases" fill="#8884d8" name="Lượt Mua" />
            <Bar dataKey="totalRevenue" fill="#82ca9d" name="Doanh Thu ($)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title={`Purchases & Revenue by Day in ${selectedYear}`} style={{ marginTop: 20 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPurchases" fill="#8884d8" name="Lượt Mua" />
            <Bar dataKey="totalRevenue" fill="#82ca9d" name="Doanh Thu ($)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default StatisticsPage;
