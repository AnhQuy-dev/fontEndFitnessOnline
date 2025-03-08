import React, { useEffect, useRef, useState } from 'react';
import { Table, notification, Button, Menu, Dropdown, Tabs, Modal, message, Tag, Input, Select, Space, Row, Col } from 'antd';
import { SearchOutlined, MoreOutlined, LineChartOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

// Import these services or create them as needed
import {
    fetchAllGoals,
    deleteGoal,
    updateGoalStatus
} from '../../../serviceToken/GoalService';

// Import modals or create them as needed
import GoalDetailModal from './GoalDetailModal';
import ProgressModal from './ProgressModal';
import DietPlanModal from './DietPlanModal';

const { Option } = Select;
const { TabPane } = Tabs;

const GoalAdmin = () => {
    const [goals, setGoals] = useState([]);
    const [filteredGoals, setFilteredGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
    const [isDietPlanModalVisible, setIsDietPlanModalVisible] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [selectedGoalTypes, setSelectedGoalTypes] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const pollingInterval = useRef(null);

    // Goal types and statuses
    const goalTypes = ['WEIGHT_LOSS', 'FAT_LOSS', 'MUSCLE_GAIN', 'ENDURANCE'];
    const goalStatuses = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'];

    // Fetch goals from API
    const fetchGoals = async () => {
        setLoading(true);
        try {
            const response = await fetchAllGoals();
            console.log("goals:", response);

            if (response) {
                setGoals(response);
                setFilteredGoals(response);
                // Clear selected row keys after fetching
                setSelectedRowKeys([]);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch goals.',
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
        fetchGoals();
        // Poll for updates every 30 seconds
        pollingInterval.current = setInterval(fetchGoals, 30000);
        return () => clearInterval(pollingInterval.current);
    }, []);

    // Apply filters when search, goal types, or statuses change
    useEffect(() => {
        applyFilters();
    }, [searchName, selectedGoalTypes, selectedStatuses, goals]);

    // Apply all filters to goals
    const applyFilters = () => {
        let filtered = [...goals];

        // Filter by name
        if (searchName) {
            filtered = filtered.filter(goal =>
                goal.fullName.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Filter by goal types
        if (selectedGoalTypes.length > 0) {
            filtered = filtered.filter(goal =>
                selectedGoalTypes.includes(goal.goalType)
            );
        }

        // Filter by statuses
        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(goal =>
                selectedStatuses.includes(goal.goalStatus)
            );
        }

        setFilteredGoals(filtered);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        applyFilters();
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchName('');
        setSelectedGoalTypes([]);
        setSelectedStatuses([]);
        setFilteredGoals(goals);
    };

    // Handle row click to show goal details
    const handleRowClick = (record) => {
        setSelectedGoal(record);
        setIsDetailsModalVisible(true);
    };

    // Handle successful goal creation
    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        fetchGoals();
    };

    // // Handle goal status update
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await updateGoalStatus(id, newStatus);
            if (response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: `Goal status updated to ${newStatus} successfully!`,
                });
                fetchGoals();
            } else {
                throw new Error('Failed to update goal status');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to change goal status.',
            });
        }
    };

    // Handle goal deletion
    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this goal?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await deleteGoal(id);
                    if (response.data === "") {
                        message.success("Goal deleted successfully!");
                        fetchGoals();
                    } else {
                        message.error(response.message || "Failed to delete goal!");
                    }
                } catch (error) {
                    message.error("Error occurred while calling API!");
                } finally {
                    setLoading(false);
                }
            },
            onCancel: () => {
                message.info("Delete operation cancelled.");
            },
        });
    };

    // Handle view progress
    const handleViewProgress = (goal) => {
        setSelectedGoal(goal);
        setIsProgressModalVisible(true);
    };

    // Handle view diet plan
    const handleViewDietPlan = (goal) => {
        setSelectedGoal(goal);
        setIsDietPlanModalVisible(true);
    };

    // Format date from array to string
    const formatDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "N/A";
        return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
    };

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    // More options dropdown menu
    const moreMenu = (record) => (
        <Menu>
            {record.progresses && record.progresses.length > 0 && (
                <Menu.Item
                    key="progress"
                    icon={<LineChartOutlined />}
                    onClick={(e) => {
                        e.domEvent.stopPropagation();
                        handleViewProgress(record);
                    }}
                >
                    View Progress
                </Menu.Item>
            )}
            {record.dietPlans && record.dietPlans.length > 0 && (
                <Menu.Item
                    key="diet"
                    icon={<FileTextOutlined />}
                    onClick={(e) => {
                        e.domEvent.stopPropagation();
                        handleViewDietPlan(record);
                    }}
                >
                    View Diet Plan
                </Menu.Item>
            )}
        </Menu>
    );

    // Table columns configuration
    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Goal Type',
            dataIndex: 'goalType',
            key: 'goalType',
            render: (type) => (
                <Tag color="blue">{type}</Tag>
            ),
        },
        {
            title: 'Target Value',
            dataIndex: 'targetValue',
            key: 'targetValue',
            render: (value, record) => (
                <span>{value} {record.goalType === 'WEIGHT_LOSS' ? 'kg' : record.goalType === 'FAT_LOSS' ? '%' : ''}</span>
            ),
        },
        {
            title: 'Start Date',
            key: 'startDate',
            render: (_, record) => (
                <span>{formatDate(record.startDate)}</span>
            ),
        },
        {
            title: 'End Date',
            key: 'endDate',
            render: (_, record) => (
                <span>{formatDate(record.endDate)}</span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'goalStatus',
            key: 'goalStatus',
            render: (status) => {
                let color = 'default';
                switch (status) {
                    case 'PLANNING':
                        color = 'orange';
                        break;
                    case 'IN_PROGRESS':
                        color = 'blue';
                        break;
                    case 'COMPLETED':
                        color = 'green';
                        break;
                    case 'PAUSED':
                        color = 'gray';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}

                        style={{
                            borderRadius: "6px",
                            backgroundColor: "#ff4d4f",
                            borderColor: "#FF6600"
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                        }}
                    >

                    </Button>
                    <Dropdown
                        overlay={moreMenu(record)}
                        trigger={['click']}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Goal Management</h2>

            {/* Filter and Search Section */}
            <div style={{ marginBottom: '20px', background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Input
                            placeholder="Search by name"
                            value={searchName}
                            onChange={handleSearchChange}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filter by goal type"
                            value={selectedGoalTypes}
                            onChange={setSelectedGoalTypes}
                            allowClear
                        >
                            {goalTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filter by status"
                            value={selectedStatuses}
                            onChange={setSelectedStatuses}
                            allowClear
                        >
                            {goalStatuses.map(status => (
                                <Option key={status} value={status}>{status}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={4} lg={4}>
                        <Space>
                            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                                Search
                            </Button>
                            <Button onClick={handleResetFilters}>
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Action Buttons */}

            <Tabs defaultActiveKey="1">
                <TabPane tab="All Goals" key="1">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredGoals) ? filteredGoals : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
                <TabPane tab="Planning" key="2">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredGoals) ? filteredGoals.filter(goal => goal.goalStatus === 'PLANNING') : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
                <TabPane tab="In Progress" key="3">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredGoals) ? filteredGoals.filter(goal => goal.goalStatus === 'IN_PROGRESS') : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
                <TabPane tab="Completed" key="4">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredGoals) ? filteredGoals.filter(goal => goal.goalStatus === 'COMPLETED') : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
            </Tabs>

            {/* Goal details modal */}
            <GoalDetailModal
                visible={isDetailsModalVisible}
                onClose={() => setIsDetailsModalVisible(false)}
                goal={selectedGoal}
                onStatusChange={handleStatusChange}
            />



            {/* Progress modal */}
            <ProgressModal
                visible={isProgressModalVisible}
                onClose={() => setIsProgressModalVisible(false)}
                goal={selectedGoal}
            />

            {/* Diet plan modal */}
            <DietPlanModal
                visible={isDietPlanModalVisible}
                onClose={() => setIsDietPlanModalVisible(false)}
                goal={selectedGoal}
            />
        </div>
    );
};

export default GoalAdmin;