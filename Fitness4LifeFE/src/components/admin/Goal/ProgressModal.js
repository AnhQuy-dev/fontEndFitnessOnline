import React, { useState } from 'react';
import { Modal, Timeline, Card, Statistic, Row, Col, Table, Empty, Tabs, Divider, Progress, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const ProgressModal = ({ visible, onClose, goal }) => {
    const [activeTab, setActiveTab] = useState('1');

    if (!goal || !goal.progresses || goal.progresses.length === 0) {
        return (
            <Modal
                title="Progress History"
                visible={visible}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Empty description="No progress data available" />
            </Modal>
        );
    }

    // Format date from array to string
    const formatDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "N/A";
        return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
    };

    // Format datetime from array to string
    const formatDateTime = (dateTimeArray) => {
        if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 3) return "N/A";
        return `${dateTimeArray[0]}-${String(dateTimeArray[1]).padStart(2, '0')}-${String(dateTimeArray[2]).padStart(2, '0')} ${String(dateTimeArray[3] || 0).padStart(2, '0')}:${String(dateTimeArray[4] || 0).padStart(2, '0')}`;
    };

    // Sort progresses by date
    const sortedProgresses = [...goal.progresses].sort((a, b) => {
        const dateA = new Date(a.trackingDate[0], a.trackingDate[1]-1, a.trackingDate[2]);
        const dateB = new Date(b.trackingDate[0], b.trackingDate[1]-1, b.trackingDate[2]);
        return dateA - dateB;
    });

    // Prepare data for the charts
    const chartData = sortedProgresses.map(progress => ({
        date: formatDate(progress.trackingDate),
        value: progress.value,
        weight: progress.weight,
        caloriesConsumed: progress.caloriesConsumed,
    }));

    // Prepare columns for the table
    const columns = [
        {
            title: 'Date',
            dataIndex: 'trackingDate',
            key: 'trackingDate',
            render: (dateArray) => formatDate(dateArray),
            sorter: (a, b) => {
                const dateA = new Date(a.trackingDate[0], a.trackingDate[1]-1, a.trackingDate[2]);
                const dateB = new Date(b.trackingDate[0], b.trackingDate[1]-1, b.trackingDate[2]);
                return dateA - dateB;
            },
        },
        {
            title: goal.goalType === 'WEIGHT_LOSS' ? 'Weight (kg)' : goal.goalType === 'FAT_LOSS' ? 'Body Fat (%)' : 'Value',
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => a.value - b.value,
        },
        {
            title: 'Current Weight (kg)',
            dataIndex: 'weight',
            key: 'weight',
            sorter: (a, b) => a.weight - b.weight,
        },
        {
            title: 'Calories Consumed',
            dataIndex: 'caloriesConsumed',
            key: 'caloriesConsumed',
            sorter: (a, b) => a.caloriesConsumed - b.caloriesConsumed,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (dateTimeArray) => formatDateTime(dateTimeArray),
            sorter: (a, b) => {
                const dateA = new Date(a.createdAt[0], a.createdAt[1]-1, a.createdAt[2], a.createdAt[3] || 0, a.createdAt[4] || 0);
                const dateB = new Date(b.createdAt[0], b.createdAt[1]-1, b.createdAt[2], b.createdAt[3] || 0, b.createdAt[4] || 0);
                return dateA - dateB;
            },
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            ellipsis: true,
        },
    ];

    // Calculate change from first to latest progress
    const firstProgress = sortedProgresses[0];
    const latestProgress = sortedProgresses[sortedProgresses.length - 1];
    const valueChange = (latestProgress.value - firstProgress.value).toFixed(1);
    const weightChange = (latestProgress.weight - firstProgress.weight).toFixed(1);
    
    // Determine if changes are positive or negative
    // For weight loss and fat loss, negative change is good
    const isValueChangePositive = goal.goalType === 'WEIGHT_LOSS' || goal.goalType === 'FAT_LOSS'
        ? valueChange <= 0
        : valueChange >= 0;
    
    const isWeightChangePositive = goal.goalType === 'WEIGHT_LOSS'
        ? weightChange <= 0
        : weightChange >= 0;

    // Calculate total progress percentage
    const calculateProgress = () => {
        if (goal.goalType === 'WEIGHT_LOSS' || goal.goalType === 'FAT_LOSS') {
            const initialValue = goal.weight; // Initial weight/fat
            const targetValue = goal.targetValue;
            const currentValue = latestProgress.value;
            
            if (currentValue <= targetValue) return 100; // Goal reached
            if (initialValue === currentValue) return 0; // No progress
            
            return Math.min(100, Math.max(0, ((initialValue - currentValue) / (initialValue - targetValue)) * 100));
        } else {
            // For other goals like muscle gain, higher is better
            const initialValue = firstProgress.value;
            const targetValue = goal.targetValue;
            const currentValue = latestProgress.value;
            
            if (currentValue >= targetValue) return 100; // Goal reached
            if (initialValue === currentValue) return 0; // No progress
            
            return Math.min(100, Math.max(0, ((currentValue - initialValue) / (targetValue - initialValue)) * 100));
        }
    };

    const progressPercent = calculateProgress();

    // Daily calorie adherence
    const calorieAdherence = sortedProgresses.map(progress => {
        const targetCalories = goal.targetCalories;
        const consumedCalories = progress.caloriesConsumed;
        const difference = consumedCalories - targetCalories;
        const adherencePercent = (consumedCalories / targetCalories) * 100;
        
        return {
            date: formatDate(progress.trackingDate),
            targetCalories,
            consumedCalories,
            difference,
            adherencePercent,
        };
    });

    return (
        <Modal
            title={`Progress History - ${goal.fullName}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Overview" key="1">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="Goal Progress" bordered={false}>
                                <Row align="middle" gutter={16}>
                                    <Col span={6}>
                                        <Progress 
                                            type="circle" 
                                            percent={Math.round(progressPercent)} 
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                        />
                                    </Col>
                                    <Col span={18}>
                                        <Statistic
                                            title="Current Value"
                                            value={latestProgress.value}
                                            precision={1}
                                            suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                            style={{ marginBottom: 16 }}
                                        />
                                        <Statistic
                                            title="Target Value"
                                            value={goal.targetValue}
                                            precision={1}
                                            suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Value Change" bordered={false}>
                                <Statistic
                                    value={Math.abs(valueChange)}
                                    precision={1}
                                    valueStyle={{ color: isValueChangePositive ? '#3f8600' : '#cf1322' }}
                                    prefix={valueChange < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                    suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                />
                                <Text type="secondary">
                                    From {firstProgress.value} to {latestProgress.value} 
                                    {goal.goalType === 'WEIGHT_LOSS' ? ' kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                </Text>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Weight Change" bordered={false}>
                                <Statistic
                                    value={Math.abs(weightChange)}
                                    precision={1}
                                    valueStyle={{ color: isWeightChangePositive ? '#3f8600' : '#cf1322' }}
                                    prefix={weightChange < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                    suffix="kg"
                                />
                                <Text type="secondary">
                                    From {firstProgress.weight} to {latestProgress.weight} kg
                                </Text>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="Progress Timeline">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Line 
                                            yAxisId="left"
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#8884d8" 
                                            name={goal.goalType === 'WEIGHT_LOSS' ? 'Weight (kg)' : goal.goalType === 'FAT_LOSS' ? 'Body Fat (%)' : 'Value'} 
                                            activeDot={{ r: 8 }} 
                                        />
                                        <Line 
                                            yAxisId="left"
                                            type="monotone" 
                                            dataKey="weight" 
                                            stroke="#82ca9d" 
                                            name="Weight (kg)" 
                                        />
                                        <Line 
                                            yAxisId="right"
                                            type="monotone" 
                                            dataKey="caloriesConsumed" 
                                            stroke="#ffc658" 
                                            name="Calories" 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="Detailed Progress" key="2">
                    <Card bordered={false}>
                        <Table 
                            dataSource={goal.progresses} 
                            columns={columns} 
                            rowKey="id" 
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Calorie Tracking" key="3">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="Daily Calorie Intake vs Target" bordered={false}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={calorieAdherence}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="targetCalories" fill="#8884d8" name="Target Calories" />
                                        <Bar dataKey="consumedCalories" fill="#82ca9d" name="Consumed Calories" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="Calorie Surplus/Deficit" bordered={false}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={calorieAdherence}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area 
                                            type="monotone" 
                                            dataKey="difference" 
                                            stroke="#ff7300" 
                                            fill="#ff7300" 
                                            name="Calorie Difference" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                                    Positive values indicate surplus, negative values indicate deficit
                                </Text>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="Progress History" key="4">
                    <Card bordered={false}>
                        <Timeline mode="left">
                            {sortedProgresses.map((progress, index) => (
                                <Timeline.Item 
                                    key={progress.id} 
                                    label={formatDate(progress.trackingDate)}
                                    color={index === sortedProgresses.length - 1 ? 'green' : 'blue'}
                                >
                                    <Card size="small" style={{ marginBottom: 0 }}>
                                        <Row gutter={[8, 8]}>
                                            <Col span={12}>
                                                <Statistic 
                                                    title={goal.goalType === 'WEIGHT_LOSS' ? 'Weight' : goal.goalType === 'FAT_LOSS' ? 'Body Fat' : 'Value'} 
                                                    value={progress.value} 
                                                    precision={1}
                                                    prefix={<CalendarOutlined />}
                                                    suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                                    valueStyle={{ fontSize: '16px' }}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Statistic 
                                                    title="Calories"
                                                    value={progress.caloriesConsumed}
                                                    prefix={<FireOutlined />}
                                                    valueStyle={{ fontSize: '16px' }}
                                                />
                                            </Col>
                                            <Col span={24}>
                                                <Text type="secondary">{progress.message}</Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default ProgressModal;