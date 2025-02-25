import React, { useEffect, useState } from "react";
import { Card, Button, Typography, List, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getDecodedToken, getTokenData } from "../../../serviceToken/tokenUtils";
import { GetAllQuestion } from "../../../serviceToken/ForumService";

const { Title, Text } = Typography;

const YourPostThread = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL"); // "ALL", "PENDING", "UNDER_REVIEW", "APPROVED"
    const navigate = useNavigate();
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await GetAllQuestion(tokenData.access_token);
                if (response.status === 200) {
                    const allPosts = response.data;

                    if (!Array.isArray(allPosts)) {
                        throw new Error("Invalid API data format. Expected an array.");
                    }

                    if (!decotoken?.id || !decotoken?.fullName) {
                        throw new Error("User data is missing or invalid.");
                    }

                    const userPosts = allPosts.filter(
                        (post) =>
                            post.author?.trim().toLowerCase() === decotoken?.fullName.trim().toLowerCase()
                    );

                    setPosts(userPosts);
                    setFilteredPosts(userPosts);
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: response.message || "Không thể tải bài viết.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể kết nối với máy chủ.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // Điều hướng đến trang chi tiết bài viết
    };

    const truncateContent = (content, length = 40) => {
        if (content.length > length) {
            return `${content.substring(0, length)}...`;
        }
        return content;
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        if (status === "ALL") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter((post) => post.status === status));
        }
    };

    return (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <Title level={2}>Bài Viết Của Bạn</Title>

            {/* Nút lọc */}
            <div style={{ marginBottom: "16px" }}>
                <Button
                    type={filterStatus === "ALL" ? "primary" : "default"}
                    onClick={() => handleFilterChange("ALL")}
                >
                    Tất cả
                </Button>
                <Button
                    type={filterStatus === "PENDING" ? "primary" : "default"}
                    onClick={() => handleFilterChange("PENDING")}
                    style={{ marginLeft: "8px" }}
                >
                    Chờ xử lý
                </Button>
                <Button
                    type={filterStatus === "UNDER_REVIEW" ? "primary" : "default"}
                    onClick={() => handleFilterChange("UNDER_REVIEW")}
                    style={{ marginLeft: "8px" }}
                >
                    Đang duyệt
                </Button>
                <Button
                    type={filterStatus === "APPROVED" ? "primary" : "default"}
                    onClick={() => handleFilterChange("APPROVED")}
                    style={{ marginLeft: "8px" }}
                >
                    Đã duyệt
                </Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : filteredPosts.length > 0 ? (
                <List
                    dataSource={filteredPosts}
                    renderItem={(post) => (
                        <List.Item>
                            <Card
                                title={post.title}
                                extra={
                                    <Button type="link" onClick={() => handlePostClick(post.id)}>
                                        Xem chi tiết
                                    </Button>
                                }
                                style={{ width: "100%" }}
                            >
                                <Text ellipsis style={{ display: "block", marginBottom: "8px" }}>
                                    {truncateContent(post.content)}{" "}
                                    {post.content.length > 40 && (
                                        <Button
                                            type="link"
                                            style={{ padding: 0 }}
                                            onClick={() => handlePostClick(post.id)}
                                        >
                                            Xem thêm
                                        </Button>
                                    )}
                                </Text>
                                <Text type="secondary">
                                    <strong>Danh mục:</strong>{" "}
                                    {Array.isArray(post.category)
                                        ? post.category.join(", ")
                                        : post.category || "Không có danh mục"}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    <strong>Trạng thái:</strong> {post.status}
                                </Text>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Text>Không có bài viết nào.</Text>
            )}
        </div>
    );
};

export default YourPostThread;
