import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { fetchPaymentStatistics } from '../../../serviceToken/StaticsticsSERVICE';

const TopPackagesStatistics = () => {
  const [topPackages, setTopPackages] = useState([]);
  const [top3Packages, setTop3Packages] = useState([]);
  const [restPackages, setRestPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPackageSales, setTotalPackageSales] = useState(0);

  const tokenData = getTokenData();

  // Process packages data to extract the most frequently purchased packages
  const processPackagesData = (orderData) => {
    // Create a map to count package occurrences
    const packageCounts = {};
    const packageTotalRevenue = {};

    // Count occurrences of each package
    orderData.forEach((order) => {
      // Ensure packageName exists and is not empty
      if (order.packageName && order.packageName.trim() !== '') {
        const packageName = order.packageName.trim();

        // Increment count
        if (!packageCounts[packageName]) {
          packageCounts[packageName] = 0;
          packageTotalRevenue[packageName] = 0;
        }
        packageCounts[packageName] += 1;

        // Add revenue
        const amount = typeof order.totalAmount === 'number'
          ? order.totalAmount
          : parseFloat(order.totalAmount || 0);
        packageTotalRevenue[packageName] += amount;
      }
    });

    // Convert to array and sort by count
    const sortedPackages = Object.keys(packageCounts).map((packageName, index) => ({
      key: index,
      packageName: packageName,
      purchaseCount: packageCounts[packageName],
      totalRevenue: packageTotalRevenue[packageName],
      averagePrice: packageTotalRevenue[packageName] / packageCounts[packageName]
    })).sort((a, b) => b.purchaseCount - a.purchaseCount);

    // Get all packages (top 10)
    const allTopPackages = sortedPackages.slice(0, 10);

    // Divide into top 3 and the rest (top 4-10)
    const top3 = allTopPackages.slice(0, 3).map((pkg, index) => ({
      ...pkg,
      rank: index + 1
    }));

    const rest = allTopPackages.slice(3, 10).map((pkg, index) => ({
      ...pkg,
      rank: index + 4  // Start from rank 4
    }));

    return {
      all: allTopPackages,
      top3,
      rest,
      totalSales: Object.values(packageTotalRevenue).reduce((sum, value) => sum + value, 0)
    };
  };

  // Fetch payment statistics data
  useEffect(() => {
    const fetchPackagesData = async () => {
      try {
        setIsLoading(true);
        // Call API to get payment data
        const response = await fetchPaymentStatistics(tokenData.access_token);

        if (response && response.data && response.data.data) {
          const orderData = response.data.data;
          const processedData = processPackagesData(orderData);

          setTopPackages(processedData.all);
          setTop3Packages(processedData.top3);
          setRestPackages(processedData.rest);
          setTotalPackageSales(processedData.totalSales);
        }
      } catch (error) {
        console.error("Error fetching package statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackagesData();
  }, [tokenData.access_token]);

  // Get rank colors (same as in the original code)
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return '#1890ff'; // Default blue
    }
  };

  // Top packages columns for the table
  const topPackagesColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Purchase Count',
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
      sorter: (a, b) => b.purchaseCount - a.purchaseCount,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      render: (count) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Total Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: (a, b) => b.totalRevenue - a.totalRevenue,
      render: (value) => <span>${value.toLocaleString()}</span>
    },
    {
      title: 'Average Price',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      render: (value) => <span>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
    }
  ];

  // Render top 3 packages (similar to the top 3 rooms in original code)
  const renderTop3Packages = () => {
    if (isLoading || top3Packages.length === 0) {
      return <div>Loading top packages data...</div>;
    }

    return (
      <div style={{ padding: '20px 0' }}>
        {/* Top 1 Package - First row */}
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
              <h3 style={{ fontSize: '20px', margin: '12px 0' }}>{top3Packages[0]?.packageName}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Statistic
                  title="Purchase Count"
                  value={top3Packages[0]?.purchaseCount}
                  valueStyle={{ color: '#ff4d4f', fontSize: '18px' }}
                />
                <Statistic
                  title="Total Revenue"
                  value={`$${top3Packages[0]?.totalRevenue.toLocaleString()}`}
                  valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                />
              </div>
              <Statistic
                title="Average Price"
                value={`$${top3Packages[0]?.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                valueStyle={{ color: '#1890ff', fontSize: '18px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Top 2 and 3 Packages - Second row */}
        <Row gutter={16} justify="center">
          {top3Packages.slice(1, 3).map((pkg, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pkg.key}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  backgroundColor: '#FAFAFA',
                  borderColor: getRankColor(pkg.rank),
                  borderWidth: '2px'
                }}
              >
                <TrophyOutlined style={{ fontSize: '24px', color: getRankColor(pkg.rank), marginBottom: '8px' }} />
                <h3 style={{ margin: '0', fontSize: '18px', color: getRankColor(pkg.rank) }}>Top {pkg.rank}</h3>
                <h4 style={{ fontSize: '16px', margin: '8px 0' }}>{pkg.packageName}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '8px' }}>
                  <Statistic
                    title="Purchase Count"
                    value={pkg.purchaseCount}
                    valueStyle={{ color: '#ff4d4f', fontSize: '16px' }}
                  />
                  <Statistic
                    title="Revenue"
                    value={`$${pkg.totalRevenue.toLocaleString()}`}
                    valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                  />
                </div>
                <Statistic
                  title="Avg Price"
                  value={`$${pkg.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
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
      {/* Top 3 packages based on purchase count */}
      <Card
        title={
          <div style={{ textAlign: 'center' }}>
            <h3>Top 3 Most Purchased Packages</h3>
            <p>Total Package Sales: ${totalPackageSales.toLocaleString()}</p>
          </div>
        }
        style={{ marginTop: 20 }}
        loading={isLoading}
        bordered={false}
      >
        {renderTop3Packages()}
      </Card>

      {/* Top 4 - 10 ranking */}
      {restPackages.length > 0 && (
        <Card
          title="Top 4 - 10 Most Purchased Packages"
          style={{ marginTop: 20 }}
          loading={isLoading}
        >
          <Table
            columns={topPackagesColumns}
            dataSource={restPackages}
            pagination={false}
            loading={isLoading}
          />
        </Card>
      )}
    </div>
  );
};

export default TopPackagesStatistics;