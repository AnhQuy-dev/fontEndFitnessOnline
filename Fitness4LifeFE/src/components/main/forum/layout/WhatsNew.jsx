import React, { useEffect, useState } from "react";
import { List, Typography, Spin, Button } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getTokenData } from "../../../../serviceToken/tokenUtils";
import { GetAllQuestion } from "../../../../serviceToken/ForumService";

const { Title, Text } = Typography;

const WhatsNew = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false); // State for showing all posts
    const navigate = useNavigate();
    const tokenData = getTokenData();//tokenData.access_token

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

    // Get displayed articles list (limit to 3 if not showAll)
    const displayedArticles = showAll ? articles : articles.slice(0, 3);

    return (
        <section id="services">
            <div style={{ padding: "16px" }}>
                <Title level={2}>Latest Posts</Title>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <List
                            dataSource={displayedArticles}
                            renderItem={(article) => (
                                <List.Item
                                    style={{
                                        borderBottom: "1px solid #f0f0f0",
                                        padding: "16px 0"
                                    }}
                                >
                                    <div>
                                        <Title
                                            level={4}
                                            style={{ marginBottom: "8px", cursor: "pointer", color: "#1890ff" }}
                                            onClick={() => navigate(`/forum/${article.id}`)} // Navigate on click
                                        >
                                            {article.title}
                                        </Title>
                                        <Text type="secondary">
                                            <strong>Author:</strong> {article.author}
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            <strong>Created:</strong>{" "}
                                            {moment(article.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")} |
                                            <strong> Category:</strong> {article.category}
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            <strong>Views:</strong> {article.viewCount} |
                                            <strong> Like:</strong> {article.upvote} |
                                            <strong> Dislike:</strong> {article.downVote}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                        {/* Show More button if not showing all */}
                        {!showAll && articles.length > 3 && (
                            <div style={{ textAlign: "center", marginTop: "16px" }}>
                                <Button type="primary" onClick={() => setShowAll(true)}>
                                    Show More
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default WhatsNew;
