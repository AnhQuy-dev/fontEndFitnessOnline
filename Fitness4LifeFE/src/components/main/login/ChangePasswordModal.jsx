import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { changePassword } from '../../../serviceToken/authService';
import { useNavigate } from 'react-router-dom'; // Dùng để chuyển hướng

const ChangePasswordModal = ({ open, onClose, email }) => {
    const navigate = useNavigate(); // Điều hướng đến trang đăng nhập
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const tokenData = localStorage.getItem("tokenData");
    const token = tokenData ? JSON.parse(tokenData).access_token : null;

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email')
            .required('Email is required'),
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'New password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    });

    const formik = useFormik({
        initialValues: {
            email: email || '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await changePassword(values,token);
                if (result.status === 200) {
                    setIsSuccessModalVisible(true); // Hiển thị modal xác nhận thành công
                } else {
                    notification.error({ message: 'Something went wrong!' });
                }
            } catch (error) {
                notification.error({ message: 'Something went wrong!' });
            }
        },
    });

    const handleSuccessOk = () => {
        setIsSuccessModalVisible(false); // Ẩn modal thành công
        onClose(); // Đóng modal
        navigate('/login'); // Chuyển hướng đến trang đăng nhập
    };

    return (
        <>
            <Modal title="Change Password" open={open} onCancel={onClose} footer={null}>
                <Form layout="vertical" onFinish={formik.handleSubmit}>
                    <Form.Item
                        label="Email"
                        validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
                        help={formik.touched.email && formik.errors.email}
                    >
                        <Input
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="Enter your email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Old Password"
                        validateStatus={formik.errors.oldPassword && formik.touched.oldPassword ? 'error' : ''}
                        help={formik.touched.oldPassword && formik.errors.oldPassword}
                    >
                        <Input.Password
                            name="oldPassword"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            placeholder="Enter old password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        validateStatus={formik.errors.newPassword && formik.touched.newPassword ? 'error' : ''}
                        help={formik.touched.newPassword && formik.errors.newPassword}
                    >
                        <Input.Password
                            name="newPassword"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            placeholder="Enter new password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Confirm New Password"
                        validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
                        help={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    >
                        <Input.Password
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            placeholder="Confirm new password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Password Changed Successfully"
                open={isSuccessModalVisible}
                onOk={handleSuccessOk}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Your password has been updated. Please log in again to continue.</p>
            </Modal>
        </>
    );
};

export default ChangePasswordModal;