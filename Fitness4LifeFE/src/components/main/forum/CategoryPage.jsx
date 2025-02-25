import { Link, useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import "../../../assets/css/CategoryPage.css";

const { Title, Text } = Typography;

const categories = [
    { name: "Nội Quy Chung", subcategories: ["Các Chính Sách Diễn Đàn Thể Hình Vui", "Nội Quy Diễn Đàn"] },
    { name: "Giáo Án Tổng Hợp", subcategories: ["Giáo Án Fitness Nam", "Giáo Án Fitness Nữ"] },
    { name: "Kiến Thức Thể Hình", subcategories: ["Giáo án Thể Hình", "Hỏi Đáp Thể Hình", "Sửa Tư Thế Kỹ Thuật Tập Luyện", "Kinh Nghiệm Dinh Dưỡng", "Review Thực Phẩm Bổ Sung"] },
    { name: "Tăng Cân - Giảm Mỡ", subcategories: ["Hỏi Đáp Giảm Cân - Giảm Mỡ", "Hỏi Đáp Tăng Cơ - Tăng Cân"] },
    { name: "Góc Thể Hiện Bản Thân", subcategories: ["Nhật Ký Thay Đổi", "Tán Gẫu Liên Quan Fitness", "HLV Thể Hình - Trao Đổi Công Việc", "CLB Phòng Gym Toàn Quốc", "Tìm Bạn Tập Cùng - Team Workout"] },
    { name: "Khu Mua Sắm - Trao Đổi", subcategories: ["Mua Bán Thực Phẩm Bổ Sung", "Dụng Cụ - Phụ Kiện Tập Luyện", "Sang Nhượng Phòng Tập"] },
    { name: "Chuyên Mục Liên Quan", subcategories: ["Võ Thuật Tổng Hợp MMA", "Cross Fit", "Powerlifting"] }
];

const CategoryPage = () => {
    const navigate = useNavigate();
    const handleCategoryClick = (subcategoryName) => {
        navigate(`/forums/forum?category=${encodeURIComponent(subcategoryName)}`);
    };

    return (
        <section id="services">
            <div className="category-container">
                <div className="category-list">
                    {categories.map((category, index) => (
                        <div key={index} className="category-group">
                            <Title level={5} className="category-title">
                                {category.name}
                            </Title>
                            <div className="subcategory-list">
                                {category.subcategories.map((sub, idx) => (
                                    <div
                                        key={idx}
                                        className="subcategory-row"
                                        onClick={() => handleCategoryClick(sub)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <FileTextOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                                        {sub}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default CategoryPage;