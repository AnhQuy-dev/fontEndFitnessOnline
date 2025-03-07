import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import "../../../assets/css/CategoryPage.css";

const { Title, Text } = Typography;

const categories = [
    { name: "General Rules", subcategories: ["Fun Fitness Forum Policies", "Forum Rules"] },
    { name: "Training Programs", subcategories: ["Men's Fitness Program", "Women's Fitness Program"] },
    { name: "Bodybuilding Knowledge", subcategories: ["General Bodybuilding Program", "Fitness Q&A", "Exercise Form & Technique Correction", "Nutrition Experience", "Supplement Reviews"] },
    { name: "Body Transformation", subcategories: ["Weight Loss & Fat Loss Q&A", "Muscle Gain & Weight Gain Q&A"] },
    { name: "Community", subcategories: ["Transformation Journal", "Fitness Related Chats", "Fitness Trainers - Job Exchange", "National Gym Clubs", "Find Workout Partners - Team Workout"] },
    { name: "Marketplace", subcategories: ["Supplement Marketplace", "Training Equipment & Accessories", "Gym Transfer & Sales"] },
    { name: "Specialized Training", subcategories: ["Mixed Martial Arts (MMA)", "CrossFit", "Powerlifting"] }
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