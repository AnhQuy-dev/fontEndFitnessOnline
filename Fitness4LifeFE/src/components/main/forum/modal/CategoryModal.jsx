import React from "react";
import { Modal, List, Typography } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Title, Text } = Typography;

const categories = [
    "Men's Fitness Program",
    "Women's Fitness Program",
    "General Bodybuilding Program",
    "Fitness Q&A",
    "Exercise Form & Technique Correction",
    "Nutrition Experience",
    "Supplement Reviews",
    "Weight Loss & Fat Loss Q&A",
    "Muscle Gain & Weight Gain Q&A",
    "Transformation Journal",
    "Fitness Related Chats",
    "Fitness Trainers - Job Exchange",
    "National Gym Clubs",
    "Find Workout Partners - Team Workout",
    "Supplement Marketplace",
    "Training Equipment & Accessories",
    "Gym Transfer & Sales",
    "Mixed Martial Arts (MMA)",
    "CrossFit",
    "Powerlifting"
]


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
