import React, { useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import { sendPromotionOneUser } from '../../../serviceToken/PromotionService';


const SendPromotionToUserModal = ({ visible, onClose }) => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!code || !code.trim() || !email || !email.trim()) {
            notification.error({
                message: 'Error',
                description: 'Please enter a valid promotion code and user email.',
            });
            return;
        }

        setLoading(true);
        try {

            const tokenData = getTokenData();
            const response = await sendPromotionOneUser(code, email, tokenData.access_token);

            if (response != null) {
                notification.success({
                    message: 'Success',
                    description: 'Promotion code sent to the user successfully!',
                });
                onClose(); // Đóng modal
                setCode(''); // Reset mã khuyến mãi
                setEmail(''); // Reset email người dùng
            } else {
                throw new Error(response || 'Failed to send promotion code.');
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
            open={visible}
            title="Send Promotion Code to a User"
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="send" type="primary" loading={loading} onClick={handleSendCode}>
                    Send
                </Button>,
            ]}
        >
            <Input
                placeholder="Enter User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <Input
                placeholder="Enter Promotion Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
        </Modal>
    );
};

export default SendPromotionToUserModal;
