import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, notification, Row, Col } from 'antd';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import { savePromotionInJson } from '../../../serviceToken/PromotionService';

const { Option } = Select;

const CreatePromotionInJsonModa = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const newPromotion = {
                ...values
            };
            console.log('new data: ', newPromotion);


            const tokenData = getTokenData();
            const response = await savePromotionInJson(newPromotion, tokenData.access_token);
            if (response != null) {
                notification.success({
                    message: 'Success',
                    description: 'Promotion created successfully!',
                });
                form.resetFields();
                onSuccess();
            } else {
                notification.error({
                    message: 'error',
                    description: 'Promotion created fasle!',
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
    return (
        <Modal
            title="Create Promotion Generate Code From Points"
            open={visible}
            onCancel={onClose}
            footer={null}
            width="60%"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please input the title!' }]}
                        >
                            <Input placeholder="Enter promotion title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please input the description!' }]}
                        >
                            <Input placeholder="Enter promotion description" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="discountType"
                            label="Discount Type"
                            rules={[{ required: true, message: 'Please select the discount type!' }]}
                        >
                            <Select mode="multiple" placeholder="Select discount types">
                                <Option value="PERCENTAGE">Percentage</Option>
                                <Option value="FIXED">Fixed Amount</Option>
                                <Option value="SERVICE">SERVICE Amount</Option>
                                <Option value="COMBO">COMBO Amount</Option>
                                <Option value="REFERRAL">REFERRAL Amount</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="discountValue"
                            label="Discount Value"
                            rules={[{ required: true, message: 'Please input the discount value!' }]}
                        >
                            <InputNumber placeholder="Enter discount value" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="isActive"
                            label="Active"
                            rules={[{ required: true, message: 'Please select the status!' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value={true}>Active</Option>
                                <Option value={false}>Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="minValue"
                            label="Minimum Value"
                            rules={[{ required: true, message: 'Please input the minimum value!' }]}
                        >
                            <InputNumber placeholder="Enter minimum value" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="createdBy"
                            label="Created By"
                            rules={[{ required: true, message: 'Please input the creator name!' }]}
                        >
                            <Input placeholder="Enter creator name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="applicableService"
                            label="Applicable Services"
                            rules={[{ required: true, message: 'Please select the applicable services!' }]}
                        >
                            <Select mode="multiple" placeholder="Select services">
                                <Option value="GYM">Gym</Option>
                                <Option value="YOGA">Yoga</Option>
                                <Option value="PT">PT</Option>
                                <Option value="MASSAGE">MASSAGE</Option>
                                <Option value="ALL">ALL</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="packageName"
                            label="Package Name"
                            rules={[{ required: true, message: 'Please select package names!' }]}
                        >
                            <Select mode="multiple" placeholder="Select package names">
                                <Option value="CLASSIC">Classic</Option>
                                <Option value="CLASSIC_PLUS">Classic Plus</Option>
                                <Option value="PRESIDENT">PRESIDENT</Option>
                                <Option value="ROYAL">ROYAL</Option>
                                <Option value="SIGNATURE">SIGNATURE</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            name="customerType"
                            label="Customer Type"
                            rules={[{ required: true, message: 'Please select the Customer Type!' }]}
                        >
                            <Select mode="multiple" placeholder="Select Customer Type">
                                <Option value="NEW">NEW</Option>
                                <Option value="RETURNING">RETURNING</Option>
                                <Option value="ALL">ALL</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="points"
                            label="point"
                            rules={[{ required: true, message: 'Please input the points value!' }]}
                        >
                            <InputNumber placeholder="Enter point value" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePromotionInJsonModa;
