import React from "react";
import { Modal, List, Typography } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Title, Text } = Typography;

const categories = [
    "Các Chính Sách Diễn Đàn Thể Hình Vui",
    "Nội Quy Diễn Đàn",
    "Giáo Án Fitness Nam",
    "Giáo Án Fitness Nữ",
    "Giáo án Thể Hình",
    "Hỏi Đáp Thể Hình",
    "Sửa Tư Thế Kỹ Thuật Tập Luyện",
    "Kinh Nghiệm Dinh Dưỡng",
    "Review Thực Phẩm Bổ Sung",
    "Hỏi Đáp Giảm Cân - Giảm Mỡ",
    "Hỏi Đáp Tăng Cơ - Tăng Cân",
    "Nhật Ký Thay Đổi",
    "Tán Gẫu Liên Quan Fitness",
    "HLV Thể Hình - Trao Đổi Công Việc",
    "CLB Phòng Gym Toàn Quốc",
    "Tìm Bạn Tập Cùng - Team Workout",
    "Mua Bán Thực Phẩm Bổ Sung",
    "Dụng Cụ - Phụ Kiện Tập Luyện",
    "Sang Nhượng Phòng Tập",
    "Võ Thuật Tổng Hợp MMA",
    "Cross Fit",
    "Powerlifting",
];

const CategoryModal = ({ visible, onClose }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        onClose(); // Đóng modal
        navigate(`/forums/create-new-post?category=${encodeURIComponent(category)}`); // Chuyển đến CreateNewPost với danh mục
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            title={<Title level={3}>Danh Sách Danh Mục</Title>}
            width="50%"
        >
            <List
                dataSource={categories}
                renderItem={(category) => (
                    <List.Item
                        onClick={() => handleCategoryClick(category)} // Điều hướng khi chọn danh mục
                        style={{
                            cursor: "pointer",
                            padding: "12px 0",
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "18px", fontWeight: "bold" }}>{category}</Text>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default CategoryModal;
