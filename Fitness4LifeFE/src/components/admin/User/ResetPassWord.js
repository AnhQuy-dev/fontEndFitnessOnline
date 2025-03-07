import { Input, Modal, Button, notification } from "antd";
import { useState } from "react";
import { GetOTP, ResetPass } from "../../../serviceToken/authService";

function ResetPassWord(props) {
    const { isChangePassOpen, setChangePassOpen, email } = props; // Nhận email từ props
    const [OTP, setOTP] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingOTP, setSendingOTP] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            notification.error({
                message: "Lỗi",
                description: "Không tìm thấy email.",
            });
            return;
        }

        try {
            setSendingOTP(true);
            await GetOTP(email); // Gọi API gửi OTP
            notification.success({
                message: "Thành công",
                description: "OTP đã được gửi đến email của bạn.",
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể gửi OTP.",
            });
        } finally {
            setSendingOTP(false);
        }
    };

    const handleResetPass = async () => {
        if (!OTP) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng nhập OTP!",
            });
            return;
        }

        try {
            setLoading(true);
            await ResetPass(email, OTP); // Gọi API ResetPass
            notification.success({
                message: "Thành công",
                description: "Mật khẩu mới đã được gửi đến email của bạn.",
            });
            resetAndCloseModal();
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "OTP không hợp lệ.",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetAndCloseModal = () => {
        setOTP("");
        setChangePassOpen(false);
    };

    return (
        <Modal
            title={<span style={{ fontWeight: "bold", fontSize: "16px" }}>Đổi mật khẩu</span>}
            open={isChangePassOpen}
            onOk={handleResetPass}
            onCancel={resetAndCloseModal}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={loading}
            maskClosable={false}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Input
                    placeholder="Email"
                    value={email} // Hiển thị email nhưng không cho chỉnh sửa
                    disabled
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Input
                        placeholder="Nhập OTP"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                    <Button
                        type="primary"
                        loading={sendingOTP}
                        onClick={handleSendOTP}
                    >
                        Gửi OTP
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ResetPassWord;
