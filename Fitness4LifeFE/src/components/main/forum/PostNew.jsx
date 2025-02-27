import React, { useEffect, useState } from "react";
import { List, Typography, Spin, Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal"; // Import CategoryModal
import { GetAllQuestion } from "../../../serviceToken/ForumService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const { Title, Text, Paragraph } = Typography;

const PostNew = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
    const navigate = useNavigate();
    const tokenData = getTokenData();

    useEffect(() => {
        const fetchAllArticles = async () => {
            try {
                const response = await GetAllQuestion(tokenData.access_token);
                if (response.status === 200) {
                    const allArticles = response.data;
                    const approvedQuestions = allArticles.filter(
                        (q) => q.status === "APPROVED"
                    );

                    // Sắp xếp các bài viết theo thời gian (từ mới đến cũ)
                    const sortedArticles = approvedQuestions.sort((a, b) =>
                        moment(b.createdAt, "YYYY-MM-DD HH:mm:ss").diff(moment(a.createdAt, "YYYY-MM-DD HH:mm:ss"))
                    );

                    setArticles(sortedArticles);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllArticles();
    }, []);

    // Hàm rút gọn nội dung
    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return `${content.substring(0, maxLength)}... `;
    };

    return (
        <section id="services">
            <div style={{ padding: "16px", position: "relative" }}>
                {/* Nút "Post Thread..." */}
                <Button
                    type="primary"
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onClick={() => setIsModalVisible(true)} // Mở modal
                >
                    Post Thread...
                </Button>

                {/* Tiêu đề */}
                <Title level={2}>Bài Viết Mới Nhất</Title>

                {/* Hiển thị danh sách bài viết */}
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        dataSource={articles}
                        renderItem={(article) => (
                            <List.Item
                                style={{
                                    borderBottom: "1px solid #f0f0f0",
                                    padding: "16px 0",
                                    display: "block" // Hiển thị các hàng theo cột
                                }}
                            >
                                {/* Hàng 1: Title */}
                                <Title
                                    level={4}
                                    style={{ marginBottom: "8px", cursor: "pointer", color: "#1890ff" }}
                                    onClick={() => navigate(`/forum/${article.id}`)} // Điều hướng khi click
                                >
                                    {article.title}
                                </Title>

                                {/* Hàng 2: Author */}
                                <Text type="secondary" style={{ marginBottom: "8px", display: "block" }}>
                                    <strong>Tác giả:</strong> {article.author}
                                </Text>

                                {/* Hàng 3: Category */}
                                <Text type="secondary" style={{ marginBottom: "8px", display: "block" }}>
                                    <strong>Chủ đề:</strong> {article.category}
                                </Text>

                                {/* Hàng 4: Content */}
                                <Paragraph style={{ marginBottom: "8px" }}>
                                    {truncateContent(article.content, 300)}

                                    <span
                                        onClick={() => navigate(`/forum/${article.id}`)} // Điều hướng khi click
                                        style={{
                                            cursor: "pointer",
                                            color: "#1890ff"
                                        }}
                                    >
                                        ... xem thêm
                                    </span>
                                </Paragraph>

                                {/* Hàng 5: Hình ảnh + Ngày tạo */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "16px" }}>
                                    {article.questionImage?.[0]?.imageUrl && (
                                        <img
                                            src={article.questionImage[0].imageUrl}
                                            alt={article.title}
                                            style={{
                                                width: "120px",
                                                height: "90px",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    )}
                                    <Text type="secondary">
                                        <strong>Ngày tạo:</strong>{" "}
                                        {moment(article.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                                    </Text>
                                </div>

                                {/* Hàng 6: Lượt xem, Like, Dislike */}
                                <Text type="secondary" style={{ display: "block" }}>
                                    <strong>Lượt xem:</strong> {article.viewCount} |
                                    <strong> Like:</strong> {article.upvote} |
                                    <strong> Dislike:</strong> {article.downVote}
                                </Text>
                            </List.Item>
                        )}
                    />
                )}

                {/* Modal hiển thị danh mục */}
                <CategoryModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)} // Đóng modal
                />
            </div>
        </section>
    );
};

export default PostNew;
