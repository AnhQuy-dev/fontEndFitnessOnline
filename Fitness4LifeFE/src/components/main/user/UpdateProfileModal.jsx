import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, notification, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { updateUserAPI } from "../../../serviceToken/authService";

const UpdateProfileModal = ({ open, onClose, userData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();

    // Gender options
    const genderOptions = [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
        { label: "Other", value: "OTHER" },
    ];

    // Marital status options
    const maritalStatusOptions = [
        { label: "Single", value: "SINGLE" },
        { label: "Married", value: "MARRIED" },
        { label: "Forever Alone", value: "FA" },
    ];

    // Handle form submission
    const handleSubmit = async (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        if (values.file) {
            formData.append("file", values.file.file);
        } else {
            // Keep the existing avatar if no new file is uploaded
            formData.append("avatar", userData.avatar);
        }

        try {
            setLoading(true);
            const response = await updateUserAPI(decotoken.id, formData, tokenData.access_token);
            if (response != null) {
                notification.success({
                    message: "Update Successful",
                    description: "User information has been updated.",
                });
                onClose(true);
            } else {
                notification.error({
                    message: "Update Failed",
                    description: response.message || "An error occurred.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Unable to update information.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Update Profile"
            open={open}
            onCancel={() => onClose()}
            footer={null}
            width="60%"
        >
            <Form
                form={form}
                initialValues={userData}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item label="Full Name" name="fullName">
                    <Input placeholder="Enter full name" />
                </Form.Item>
                <Form.Item label="Hobbies" name="hobbies">
                    <Input placeholder="Enter hobbies" />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone">
                    <Input placeholder="Enter phone number" />
                </Form.Item>
                <Form.Item label="Gender" name="gender">
                    <Select placeholder="Select gender">
                        {genderOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Address" name="address">
                    <Input placeholder="Enter address" />
                </Form.Item>
                <Form.Item label="Age" name="age">
                    <Input type="number" placeholder="Enter age" />
                </Form.Item>
                <Form.Item label="Marital Status" name="maritalStatus">
                    <Select placeholder="Select marital status">
                        {maritalStatusOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Height" name="heightValue">
                    <Input type="number" placeholder="Enter height (cm)" />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Enter description" />
                </Form.Item>
                <Form.Item name="role">
                    <Input placeholder="Role" hidden />
                </Form.Item>
                <Form.Item label="Profile Picture" name="file" valuePropName="file">
                    <Upload beforeUpload={() => false} listType="picture">
                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Update
                </Button>
            </Form>
        </Modal>
    );
};

export default UpdateProfileModal;
