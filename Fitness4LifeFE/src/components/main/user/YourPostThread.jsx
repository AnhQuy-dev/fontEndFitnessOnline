import React, { useState, useEffect } from "react";
import {
    Typography,
    Card,
    Button,
    Spin,
    notification,
    Space,
    Select,
    Empty,
    Tag,
    Pagination,
    Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
    InboxOutlined,
    ClockCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { GetAllQuestion, deleteQuestion } from "../../../serviceToken/ForumService";
import "../../../assets/css/postThread.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const YourPostThread = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const tokenData = getTokenData();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion(tokenData.access_token);
            if (response.status === 200) {
                setPosts(response.data);
            } else {
                notification.error({
                    message: "Error",
                    description: response.message || "Failed to load posts",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Could not connect to server",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    console.log("posts: ", posts);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await deleteQuestion(id, tokenData.access_token);
            if (response.status === 200) {
                notification.success({
                    message: "Success",
                    description: "Post deleted successfully",
                });
                fetchPosts();
            } else {
                notification.error({
                    message: "Error",
                    description: response.message || "Failed to delete post",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Could not connect to server",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts
        .filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                post.content.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusTag = (status) => {
        switch (status) {
            case "PENDING":
                return <Tag className="post-status status-pending">Pending</Tag>;
            case "APPROVED":
                return <Tag className="post-status status-approved">Approved</Tag>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading posts..." />
            </div>
        );
    }

    return (
        <section className="thread-container">
            <div className="thread-header">
                <Title level={2} className="thread-title">
                    Your Posts
                </Title>
                <Text className="thread-description">
                    Manage and track all your posts in one place
                </Text>
            </div>

            <div className="thread-filters">
                <div className="filter-group">
                    <Input
                        placeholder="Search posts..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Select
                        defaultValue="ALL"
                        style={{ width: 150 }}
                        onChange={setStatusFilter}
                    >
                        <Option value="ALL">All Status</Option>
                        <Option value="PENDING">Pending</Option>
                        <Option value="APPROVED">Approved</Option>
                    </Select>

                </div>
            </div>

            {paginatedPosts.length === 0 ? (
                <div className="empty-state">
                    <InboxOutlined className="empty-state-icon" />
                    <Title level={4}>No Posts Found</Title>
                    <Text type="secondary">
                        Start by creating your first post or try different search criteria
                    </Text>
                </div>
            ) : (
                <div className="post-grid">
                    {paginatedPosts.map((post) => (
                        <Card key={post.id} className="post-card" hoverable>
                            <div className="post-card-content">
                                <Title
                                    level={4}
                                    className="post-card-title"
                                    onClick={() => navigate(`/profile/post/${post.id}`)}
                                >
                                    {post.title}
                                </Title>

                                <div className="post-card-meta">
                                    <Space>
                                        <UserOutlined />
                                        <Text type="secondary">{post.author}</Text>
                                    </Space>
                                    <Space>
                                        <ClockCircleOutlined />
                                        <Text type="secondary">
                                            {moment(post.createdAt).format("MMM DD, YYYY")}
                                        </Text>
                                    </Space>
                                </div>

                                <Paragraph
                                    className="post-card-description"
                                    ellipsis={{ rows: 2 }}
                                >
                                    {post.content}
                                </Paragraph>

                                <div className="post-card-footer">
                                    {getStatusTag(post.status)}
                                    <div className="post-actions">
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={() =>
                                                navigate(`/profile/update-question/${post.id}`, {
                                                    state: { post },
                                                })
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="pagination-container">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredPosts.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </div>
        </section>
    );
};

export default YourPostThread;
