import React, { useEffect, useState } from "react";
import { Typography, Divider, Spin, notification, Button, Tag, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { GetAllQuestion } from "../../../serviceToken/ForumService";
import { EditOutlined, ClockCircleOutlined, UserOutlined, TagOutlined, FolderOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../../assets/css/postDetail.css";

const { Title, Text, Paragraph } = Typography;

const YourPostDetailPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const tokenData = getTokenData();

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await GetAllQuestion(tokenData.access_token);
                if (response.status === 200) {
                    const allPosts = response.data;
                    const foundPost = allPosts.find((p) => p.id === Number(postId));
                    setPost(foundPost || null);
                } else {
                    notification.error({
                        message: "Error",
                        description: response.message || "Could not load post details.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "Could not connect to server.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [postId, tokenData.access_token]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading post details..." />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="error-message">
                <Title level={4}>Post not found</Title>
                <Button type="primary" onClick={() => navigate("/profile/your-posts")}>
                    Back to Posts
                </Button>
            </div>
        );
    }

    return (
        <section className="post-detail-container" id="services">
            <div className="post-detail-header">
                <Title level={2} className="post-title">
                    {post.title}
                </Title>

                <div className="post-meta">
                    <Space>
                        <UserOutlined />
                        <Text type="secondary">Author: {post.author}</Text>
                    </Space>
                    <Divider type="vertical" />
                    <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                            {post.createdAt ? moment(post.createdAt).format("MMMM Do YYYY, h:mm a") : "Date not available"}
                        </Text>
                    </Space>
                </div>
            </div>

            <div className="post-content">
                <Paragraph>{post.content}</Paragraph>
            </div>

            <div className="post-tags">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div className="post-tag-item">
                        <Space>
                            <TagOutlined />
                            <Text strong>Tags:</Text>
                            {post.tag?.split(",").map((tag, index) => (
                                <Tag key={index} color="blue">{tag.trim()}</Tag>
                            ))}
                        </Space>
                    </div>

                    <div className="post-tag-item">
                        <Space>
                            <FolderOutlined />
                            <Text strong>Categories:</Text>
                            {post.category?.map((cat, index) => (
                                <Tag key={index} color="green">{cat}</Tag>
                            ))}
                        </Space>
                    </div>
                </Space>
            </div>

            {post.questionImage?.length > 0 && (
                <div className="post-images">
                    <Title level={4}>Images</Title>
                    {post.questionImage.map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Post image ${index + 1}`}
                            className="post-image"
                        />
                    ))}
                </div>
            )}

            <div className="action-buttons">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="large"
                    onClick={() =>
                        navigate(`/profile/update-question/${postId}`, {
                            state: { post },
                        })
                    }
                >
                    Edit Post
                </Button>
                <Button
                    size="large"
                    onClick={() => navigate("/profile/your-posts")}
                >
                    Back to Posts
                </Button>
            </div>
        </section>
    );
};

export default YourPostDetailPage;
