import React, { useState } from 'react';
import { Modal, Tabs, Card, Typography, Empty, Collapse, Tag } from 'antd';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const DietPlanModal = ({ visible, onClose, goal }) => {
    const [activeTab, setActiveTab] = useState('1');

    if (!goal || !goal.dietPlans || goal.dietPlans.length === 0) {
        return (
            <Modal
                title="Diet Plans"
                visible={visible}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Empty description="No diet plans available" />
            </Modal>
        );
    }

    // Format text with proper line breaks and markdown-like formatting
    const formatText = (text) => {
        if (!text) return null;

        // Split by newlines
        const paragraphs = text.split('\n\n');
        
        return paragraphs.map((paragraph, pIndex) => {
            // Check if paragraph is a heading (starts with *)
            if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                return (
                    <Title level={4} key={`p-${pIndex}`}>
                        {paragraph.replace(/\*\*/g, '')}
                    </Title>
                );
            }
            
            // Check if paragraph contains list items
            if (paragraph.includes('*')) {
                const lines = paragraph.split('\n');
                return (
                    <div key={`p-${pIndex}`}>
                        {lines.map((line, lIndex) => {
                            if (line.trim().startsWith('*')) {
                                return (
                                    <Paragraph key={`l-${lIndex}`}>
                                        • {line.replace('*', '').trim()}
                                    </Paragraph>
                                );
                            }
                            return <Paragraph key={`l-${lIndex}`}>{line}</Paragraph>;
                        })}
                    </div>
                );
            }
            
            // Regular paragraph
            return <Paragraph key={`p-${pIndex}`}>{paragraph}</Paragraph>;
        });
    };

    return (
        <Modal
            title={`Diet Plans - ${goal.fullName}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                tabPosition="left"
            >
                {goal.dietPlans.map((dietPlan, index) => (
                    <TabPane 
                        tab={`Plan ${index + 1}`} 
                        key={(index + 1).toString()}
                    >
                        <Card title={`Diet Plan ${index + 1}`} bordered={false}>
                            <Tag color="blue" style={{ marginBottom: 16 }}>
                                Daily Calorie Goal: {goal.targetCalories.toFixed(2)} kcal
                            </Tag>
                            
                            <Collapse defaultActiveKey={['1']} bordered={false}>
                                <Panel header="Diet Plan" key="1">
                                    <Typography>
                                        {formatText(dietPlan.dietPlan)}
                                    </Typography>
                                </Panel>
                                
                                {dietPlan.workoutPlan && dietPlan.workoutPlan !== "No workout plan provided" && (
                                    <Panel header="Workout Plan" key="2">
                                        <Typography>
                                            {formatText(dietPlan.workoutPlan)}
                                        </Typography>
                                    </Panel>
                                )}
                            </Collapse>
                        </Card>
                    </TabPane>
                ))}
            </Tabs>
        </Modal>
    );
};

export default DietPlanModal;