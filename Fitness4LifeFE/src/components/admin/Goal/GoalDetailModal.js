import React from 'react';
import { Modal, Descriptions, Tag, Button, Divider, Row, Col, Statistic, Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const GoalDetailsModal = ({ visible, onClose, goal, onStatusChange }) => {
    if (!goal) return null;

    // Format date from array to string
    const formatDate = (dateArray) => {
        if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return "N/A";
        return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
    };

    // Format datetime from array to string
    const formatDateTime = (dateTimeArray) => {
        if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 3) return "N/A";
        return `${dateTimeArray[0]}-${String(dateTimeArray[1]).padStart(2, '0')}-${String(dateTimeArray[2]).padStart(2, '0')} ${String(dateTimeArray[3]).padStart(2, '0')}:${String(dateTimeArray[4]).padStart(2, '0')}`;
    };

    // Calculate progress
    const calculateProgress = () => {
        const currentValue = parseFloat(goal.currentValue);
        const targetValue = parseFloat(goal.targetValue);
        
        // For weight loss and fat loss, lower is better
        if (goal.goalType === 'WEIGHT_LOSS' || goal.goalType === 'FAT_LOSS') {
            if (currentValue <= targetValue) return 100; // Goal reached
            const initial = parseFloat(goal.weight); // Initial weight/fat
            if (initial === currentValue) return 0; // No progress
            return Math.min(100, Math.max(0, ((initial - currentValue) / (initial - targetValue)) * 100));
        }
        
        // For other goals like muscle gain, higher is better
        if (currentValue >= targetValue) return 100; // Goal reached
        const initial = goal.initialValue || 0; // Initial value
        if (initial === currentValue) return 0; // No progress
        return Math.min(100, Math.max(0, ((currentValue - initial) / (targetValue - initial)) * 100));
    };

    // Get progress color
    const getProgressColor = (progress) => {
        if (progress >= 80) return "#52c41a"; // Green
        if (progress >= 50) return "#1890ff"; // Blue
        if (progress >= 20) return "#faad14"; // Yellow
        return "#f5222d"; // Red
    };

    // Progress percentage
    const progressPercent = calculateProgress();
    const progressColor = getProgressColor(progressPercent);

    // Check if progress is positive or negative for weight/fat loss
    const isPositiveProgress = goal.goalType === 'WEIGHT_LOSS' || goal.goalType === 'FAT_LOSS' 
        ? goal.currentValue < goal.weight 
        : goal.currentValue > (goal.initialValue || 0);
        
    // Get color for goal status tag
    const getStatusColor = (status) => {
        switch (status) {
            case 'PLANNING':
                return 'orange';
            case 'IN_PROGRESS':
                return 'blue';
            case 'COMPLETED':
                return 'green';
            case 'PAUSED':
                return 'gray';
            default:
                return 'purple';
        }
    };

    return (
        <Modal
            title={`Goal Details - ${goal.fullName}`}
            visible={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card bordered={false}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic
                                    title="Current Value"
                                    value={goal.currentValue}
                                    precision={1}
                                    valueStyle={{ color: isPositiveProgress ? '#3f8600' : '#cf1322' }}
                                    prefix={isPositiveProgress ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                    suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Target Value"
                                    value={goal.targetValue}
                                    precision={1}
                                    suffix={goal.goalType === 'WEIGHT_LOSS' ? 'kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Progress"
                                    value={progressPercent}
                                    precision={1}
                                    valueStyle={{ color: progressColor }}
                                    suffix="%"
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider orientation="left">Goal Information</Divider>
            
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Goal ID">{goal.id}</Descriptions.Item>
                <Descriptions.Item label="User ID">{goal.userId}</Descriptions.Item>
                <Descriptions.Item label="Goal Type">
                    <Tag color="blue">{goal.goalType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(goal.goalStatus)}>{goal.goalStatus}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Start Date">{formatDate(goal.startDate)}</Descriptions.Item>
                <Descriptions.Item label="End Date">{formatDate(goal.endDate)}</Descriptions.Item>
                <Descriptions.Item label="Initial Weight">{goal.weight} kg</Descriptions.Item>
                <Descriptions.Item label="Activity Level">
                    <Tag color="green">{goal.activityLevel}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Target Calories">{goal.targetCalories.toFixed(2)} kcal</Descriptions.Item>
                <Descriptions.Item label="Created At">{formatDateTime(goal.createdAt)}</Descriptions.Item>
            </Descriptions>

            {goal.progresses && goal.progresses.length > 0 && (
                <>
                    <Divider orientation="left">Latest Progress</Divider>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Tracking Date">
                            {formatDate(goal.progresses[goal.progresses.length - 1].trackingDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Value">
                            {goal.progresses[goal.progresses.length - 1].value}
                            {goal.goalType === 'WEIGHT_LOSS' ? ' kg' : goal.goalType === 'FAT_LOSS' ? '%' : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Calories Consumed">
                            {goal.progresses[goal.progresses.length - 1].caloriesConsumed} kcal
                        </Descriptions.Item>
                        <Descriptions.Item label="Weight">
                            {goal.progresses[goal.progresses.length - 1].weight} kg
                        </Descriptions.Item>
                        <Descriptions.Item label="Message" span={2}>
                            {goal.progresses[goal.progresses.length - 1].message}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}

            {goal.dietPlans && goal.dietPlans.length > 0 && (
                <>
                    <Divider orientation="left">Diet Plan Summary</Divider>
                    <p>Latest diet plan created on: {formatDateTime(goal.createdAt)}</p>
                    <p>Click the "View Diet Plan" option to see the complete diet plan.</p>
                </>
            )}
        </Modal>
    );
};

export default GoalDetailsModal;