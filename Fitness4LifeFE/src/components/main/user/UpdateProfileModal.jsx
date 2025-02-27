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

    // Giá trị enum cho Gender
    const genderOptions = [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
        { label: "Other", value: "OTHER" },
    ];

    // Giá trị enum cho MaritalStatus
    const maritalStatusOptions = [
        { label: "Single", value: "SINGLE" },
        { label: "Married", value: "MARRIED" },
        { label: "Forever Alone", value: "FA" },
    ];

    // Xử lý submit form
    const handleSubmit = async (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        if (values.file) {
            formData.append("file", values.file.file);
        }
        else {
            // Giữ nguyên avatar nếu không có file mới
            formData.append("avatar", userData.avatar);
        }

        try {
            setLoading(true);
            const response = await updateUserAPI(decotoken.id, formData, tokenData.access_token);
            if (response != null) {
                notification.success({
                    message: "Cập nhật thành công",
                    description: "Thông tin người dùng đã được cập nhật.",
                });
                onClose(true);
            } else {
                notification.error({
                    message: "Cập nhật thất bại",
                    description: response.message || "Có lỗi xảy ra.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể cập nhật thông tin.",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal
            title="Cập Nhật Thông Tin"
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
                <Form.Item label="Họ và tên" name="fullName">
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item label="Sở thích" name="hobbies">
                    <Input placeholder="Nhập sở thích" />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone">
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender">
                    <Select placeholder="Chọn giới tính">
                        {genderOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                    <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item label="Tuổi" name="age">
                    <Input type="number" placeholder="Nhập tuổi" />
                </Form.Item>
                <Form.Item label="Tình trạng hôn nhân" name="maritalStatus">
                    <Select placeholder="Chọn tình trạng hôn nhân">
                        {maritalStatusOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Chiều cao" name="heightValue">
                    <Input type="number" placeholder="Nhập chiều cao (cm)" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                </Form.Item>
                <Form.Item label="Vai trò" name="role">
                    <Input placeholder="Vai trò" disabled />
                </Form.Item>
                <Form.Item label="Ảnh đại diện" name="file" valuePropName="file">
                    <Upload beforeUpload={() => false} listType="picture">
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Cập Nhật
                </Button>
            </Form>
        </Modal>
    );
};

export default UpdateProfileModal;
