import React, { useEffect, useState } from "react";
import { List, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { GetAllQuestion } from "../../../serviceToken/ForumService";

const { Title, Text } = Typography;

const RecommendedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const tokenData = getTokenData();//tokenData.access_token

    // Hàm giới hạn ký tự hiển thị
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + "...";
    };

    useEffect(() => {
        const fetchRecommendedArticles = async () => {
            try {
                const response = await GetAllQuestion(tokenData.access_token);
                if (response.status === 200) {
                    const allArticles = response.data;

                    // Sắp xếp theo viewCount và upvote
                    const sortedArticles = allArticles
                        .sort((a, b) => b.viewCount - a.viewCount || b.upvote - a.upvote)
                        .slice(0, 4); // Lấy top 4 bài viết

                    setArticles(sortedArticles);
                }
            } catch (error) {
                console.error("Error fetching recommended articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedArticles();
    }, []);

    return (
        <section id="services">
            <div style={{ padding: "16px" }}>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        dataSource={articles}
                        renderItem={(article) => (
                            <List.Item
                                onClick={() => navigate(`/forum/${article.id}`)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f0f0f0"
                                }}
                            >
                                {/* Hình ảnh */}
                                <img
                                    src={
                                        article.questionImage?.[0]?.imageUrl ||
                                        "https://via.placeholder.com/80x80?text=No+Image"
                                    }
                                    alt={article.title}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginRight: "16px"
                                    }}
                                />
                                {/* Nội dung */}
                                <div>
                                    <Title
                                        level={5}
                                        style={{
                                            marginBottom: "4px",
                                            color: "#333",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {truncateText(article.title, 50)}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: "12px" }}>
                                        {moment(article.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                                    </Text>

                                </div>
                            </List.Item>
                        )}
                    />
                )}

            </div>

        </section>
    );
};

export default RecommendedArticles;
