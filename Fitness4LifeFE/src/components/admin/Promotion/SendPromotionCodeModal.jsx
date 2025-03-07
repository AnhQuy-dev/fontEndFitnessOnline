import React, { useState } from 'react';
import { Modal, Input, Button, notification } from 'antd';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import { sendPromotionOfUser } from '../../../serviceToken/PromotionService';


const SendPromotionCodeModal = ({ visible, onClose }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!code.trim()) {
            notification.error({ message: 'Error', description: 'Please enter a valid promotion code.' });
            return;
        }

        setLoading(true);
        try {
            const tokenData = getTokenData();
            console.log("t", tokenData.access_token);
            const response = await sendPromotionOfUser(code, tokenData.access_token);
            console.log("data của reponse trong send all", response);

            if (response != null) {
                notification.success({
                    message: 'Success',
                    description: 'Promotion code sent to all users successfully!',
                });
                onClose(); // Đóng modal
                setCode(''); // Reset input
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
            title="Send Promotion Code to All Users"
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
                placeholder="Enter Promotion Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
        </Modal>
    );
};

export default SendPromotionCodeModal;
