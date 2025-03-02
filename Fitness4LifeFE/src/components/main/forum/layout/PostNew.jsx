import React, { useEffect, useState } from "react";
import { List, Typography, Spin, Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../modal/CategoryModal"; // Import CategoryModal
import { GetAllQuestion } from "../../../../serviceToken/ForumService";
import { getTokenData } from "../../../../serviceToken/tokenUtils";

const { Title, Text, Paragraph } = Typography;

const PostNew = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
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

                    // Sort articles by time (newest to oldest)
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

    // Function to truncate content
    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return `${content.substring(0, maxLength)}... `;
    };

    return (
        <section id="services">
            <div style={{ padding: "16px", position: "relative" }}>
                {/* Post Thread button */}
                <Button
                    type="primary"
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onClick={() => setIsModalVisible(true)} // Open modal
                >
                    Post Thread...
                </Button>

                {/* Title */}
                <Title level={2}>Latest Posts</Title>

                {/* Display posts list */}
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
                                    display: "block" // Display rows in column
                                }}
                            >
                                {/* Row 1: Title */}
                                <Title
                                    level={4}
                                    style={{ marginBottom: "8px", cursor: "pointer", color: "#1890ff" }}
                                    onClick={() => navigate(`/forum/${article.id}`)} // Navigate on click
                                >
                                    {article.title}
                                </Title>

                                {/* Row 2: Author */}
                                <Text type="secondary" style={{ marginBottom: "8px", display: "block" }}>
                                    <strong>Author:</strong> {article.author}
                                </Text>

                                {/* Row 3: Category */}
                                <Text type="secondary" style={{ marginBottom: "8px", display: "block" }}>
                                    <strong>Category:</strong> {article.category}
                                </Text>

                                {/* Row 4: Content */}
                                <Paragraph style={{ marginBottom: "8px" }}>
                                    {truncateContent(article.content, 300)}

                                    <span
                                        onClick={() => navigate(`/forum/${article.id}`)} // Navigate on click
                                        style={{
                                            cursor: "pointer",
                                            color: "#1890ff"
                                        }}
                                    >
                                        ... read more
                                    </span>
                                </Paragraph>

                                {/* Row 5: Image + Creation date */}
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
                                        <strong>Created:</strong>{" "}
                                        {moment(article.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                                    </Text>
                                </div>

                                {/* Row 6: Views, Like, Dislike */}
                                <Text type="secondary" style={{ display: "block" }}>
                                    <strong>Views:</strong> {article.viewCount} |
                                    <strong> Like:</strong> {article.upvote} |
                                    <strong> Dislike:</strong> {article.downVote}
                                </Text>
                            </List.Item>
                        )}
                    />
                )}

                {/* Category selection modal */}
                <CategoryModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)} // Close modal
                />
            </div>
        </section>
    );
};

export default PostNew;
