import "../../../assets/css/postAdmin.css";
import React, { useEffect, useState } from "react";
import { Spin, Typography, message, Card, Button, Pagination, Tabs, Select } from "antd";
import moment from "moment";
import QuestionDetailModal from "./QuestionDetailModal";
import CreateQuestionModal from "./CreateQuestionModal";
import { changePublished, deleteQuestion, GetAllQuestion } from "../../../serviceToken/ForumService";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const PostPage = () => {
    const [privateQuestions, setPrivateQuestions] = useState([]);
    const [publicQuestions, setPublicQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [privateCurrentPage, setPrivateCurrentPage] = useState(1);
    const [publicCurrentPage, setPublicCurrentPage] = useState(1);

    const [pageSize] = useState(6); // Số bài viết trên mỗi trang
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState("ALL"); // Trạng thái lọc của bài viết bên USER tab
    const tokenData = getTokenData();
    const navigate = useNavigate();

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion(tokenData.access_token);
            console.log("response: ", response);
            if (response.status === 200) {
                // Phân loại bài viết theo rolePost
                const privatePosts = response.data.filter((q) => q.rolePost === "PRIVATES");
                const publicPosts = response.data.filter((q) => q.rolePost === "PUBLICED");

                console.log("privatePosts: ", privatePosts);
                console.log("publicPosts: ", publicPosts);

                setPrivateQuestions(privatePosts);
                setPublicQuestions(publicPosts);

                // message.success("Lấy danh sách bài viết thành công!");
            } else {
                message.error(response.message || "Failed to get post list!");
            }
        } catch (error) {
            message.error("An error occurred while calling API!");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (id) => {
        message.info(`Update post ID: ${id}`);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await deleteQuestion(id, tokenData.access_token);
            console.log("response: ", response);
            if (response.status === 200) {
                message.success("Post deleted successfully!");
                fetchQuestions();
            } else {
                message.error(response.message || "Failed to delete post!");
            }
        } catch (error) {
            message.error("An error occurred while calling API!");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (questionId, newStatus) => {
        try {
            setLoading(true);
            const currentQuestion = [...publicQuestions, ...privateQuestions].find(q => q.id === questionId);
            if (currentQuestion.status === "PENDING" && newStatus === "APPROVED") {
                const changeStatus = { status: newStatus };
                const response = await changePublished(questionId, changeStatus, tokenData.access_token);
                console.log("response: ", response);

                if (response.status === 201) {
                    message.success("Post status updated successfully!");
                    fetchQuestions();
                } else {
                    message.error(response.message || "Failed to update status!");
                }
            } else {
                message.error("Can only change status from PENDING to APPROVED.");
            }
        } catch (error) {
            message.error("An error occurred while updating status!");
        } finally {
            setLoading(false);
        }
    };


    const openModal = (post) => {
        setSelectedQuestion(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };

    const onCreateQuestion = () => {
        setIsCreateModalOpen(true);
    };

    const onCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Pagination logic
    const getCurrentPageData = (data, page) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    const privateCurrentQuestions = getCurrentPageData(privateQuestions, privateCurrentPage);
    const publicCurrentQuestions = getCurrentPageData(publicQuestions, publicCurrentPage);

    // Lọc câu hỏi theo trạng thái
    const filteredPublicQuestions = filterStatus === "ALL"
        ? publicQuestions
        : publicQuestions.filter((q) => q.status === filterStatus);

    return (
        <div className="post-page-container">
            <Title level={2} className="post-page-title">
                Post List
            </Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="ADMIN" key="1">
                    <Button type="primary" onClick={onCreateQuestion}>
                        Create Post
                    </Button>

                    {loading ? (
                        <div className="loading-container">
                            <Spin tip="Loading data..." size="large" />
                        </div>
                    ) : (
                        <div>
                            <div className="post-grid">
                                {privateCurrentQuestions.map((post) => (
                                    <Card
                                        key={post.id}
                                        className="post-card"
                                        hoverable
                                    >
                                        <div className="post-card-content">
                                            <Title
                                                level={4}
                                                className="post-card-title"
                                                onClick={() => openModal(post)} // Chỉ mở modal khi click vào title
                                            >
                                                {post.title}
                                            </Title>
                                            <Text type="secondary" className="forum-author">
                                                {post.author} -{" "}
                                                {post.createdAt
                                                    ? moment(post.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")
                                                    : "No creation date"}
                                            </Text>
                                            <Paragraph
                                                ellipsis={{ rows: 2, expandable: false }}
                                                className="post-card-paragraph"
                                            >
                                                {post.content}
                                            </Paragraph>
                                            <div className="post-card-actions">
                                                <Button
                                                    type="primary"
                                                    onClick={() =>
                                                        navigate(`/admin/update-question/${post.id}`, {
                                                            state: { post },
                                                        })
                                                    }>
                                                    Update
                                                </Button>
                                                <Button danger onClick={() => handleDelete(post.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <Pagination
                                current={privateCurrentPage}
                                pageSize={pageSize}
                                total={privateQuestions.length}
                                onChange={(page) => setPrivateCurrentPage(page)}
                                style={{ marginTop: "20px", textAlign: "center" }}
                            />
                        </div>
                    )}
                </TabPane>

                <TabPane tab="USER" key="2">
                    <div className="filter-buttons">
                        <Button onClick={() => setFilterStatus("ALL")}>ALL</Button>
                        <Button onClick={() => setFilterStatus("PENDING")}>PENDING</Button>
                        <Button onClick={() => setFilterStatus("APPROVED")}>APPROVED</Button>
                    </div>
                    {loading ? (
                        <div className="loading-container">
                            <Spin tip="Loading data..." size="large" />
                        </div>
                    ) : (
                        <div>
                            <div className="post-grid">
                                {filteredPublicQuestions.map((question) => (
                                    <Card
                                        key={question.id}
                                        className="post-card"
                                        hoverable
                                    >
                                        <div className="post-card-content">
                                            <Title
                                                level={4}
                                                className="post-card-title"
                                                onClick={() => openModal(question)} // Chỉ mở modal khi click vào title
                                            >
                                                {question.title}
                                            </Title>
                                            <Text type="secondary" className="forum-author">
                                                {question.author} -{" "}
                                                {question.createdAt
                                                    ? moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")
                                                    : "No creation date"}
                                            </Text>
                                            <Paragraph
                                                ellipsis={{ rows: 2, expandable: false }}
                                                className="post-card-paragraph"
                                            >
                                                {question.content}
                                            </Paragraph>
                                            <div className="post-card-actions">
                                                {/* Thêm select dropdown cho các bài post có trạng thái "PENDING" */}
                                                {question.status === "PENDING" && (
                                                    <Select
                                                        value={question.status}
                                                        onChange={(value) => handleStatusChange(question.id, value)}
                                                        style={{ width: 120 }}
                                                    >
                                                        <Option value="PENDING">PENDING</Option>
                                                        <Option value="APPROVED">APPROVED</Option>
                                                    </Select>
                                                )}
                                                <Button danger onClick={() => handleDelete(question.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <Pagination
                                current={publicCurrentPage}
                                pageSize={pageSize}
                                total={filteredPublicQuestions.length}
                                onChange={(page) => setPublicCurrentPage(page)}
                                style={{ marginTop: "20px", textAlign: "center" }}
                            />
                        </div>
                    )}
                </TabPane>
            </Tabs>

            <QuestionDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                question={selectedQuestion}
            />
            <CreateQuestionModal
                isOpen={isCreateModalOpen}
                onClose={onCloseCreateModal}
                onQuestionCreated={fetchQuestions}
            />
        </div>
    );
};

export default PostPage;
