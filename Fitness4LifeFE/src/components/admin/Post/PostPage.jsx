import "../../../assets/css/postAdmin.css";
import React, { useEffect, useState } from "react";
import { Spin, Typography, message, Card, Button, Pagination, Tabs, Select } from "antd";
import { changePublished, deleteQuestion, GetAllQuestion } from "../../../services/forumService"; // Giả sử bạn có API updateStatus
import moment from "moment";
import QuestionDetailModal from "./QuestionDetailModal";
import CreateQuestionModal from "./CreateQuestionModal";

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

    // const fetchQuestions = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await GetAllQuestion();
    //         if (response.status === 200) {
    //             // Phân loại bài viết theo rolePost
    //             const privatePosts = response.data.data.filter((q) => q.rolePost === "PRIVATES");
    //             const publicPosts = response.data.data.filter((q) => q.rolePost === "PUBLICED");

    //             setPrivateQuestions(privatePosts);
    //             setPublicQuestions(publicPosts);

    //             // message.success("Lấy danh sách bài viết thành công!");
    //         } else {
    //             message.error(response.message || "Lấy danh sách thất bại!");
    //         }
    //     } catch (error) {
    //         message.error("Có lỗi xảy ra khi gọi API!");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleUpdate = (id) => {
        message.info(`Cập nhật bài viết ID: ${id}`);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await deleteQuestion(id);
            if (response.status === 200) {
                message.success("Xóa bài viết thành công!");
                // fetchQuestions(); // Tải lại danh sách bài viết sau khi xóa
            } else {
                message.error(response.message || "Xóa bài viết thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gọi API!");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (questionId, newStatus) => {
        try {
            setLoading(true);

            // Lấy trạng thái hiện tại của câu hỏi
            const currentQuestion = [...publicQuestions, ...privateQuestions].find(q => q.id === questionId);

            // Kiểm tra nếu trạng thái mới không hợp lệ
            if (currentQuestion.status === "PENDING" && newStatus === "UNDER_REVIEW") {
                // Thực hiện thay đổi trạng thái
                const changeStatus = { status: newStatus };
                const response = await changePublished(questionId, changeStatus);

                if (response.status === 201) {
                    message.success("Cập nhật trạng thái bài viết thành công!");
                    // fetchQuestions(); // Tải lại danh sách bài viết sau khi cập nhật trạng thái
                } else {
                    message.error(response.message || "Cập nhật trạng thái thất bại!");
                }
            } else if (currentQuestion.status === "UNDER_REVIEW" && newStatus === "APPROVED") {
                // Thực hiện thay đổi trạng thái
                const changeStatus = { status: newStatus };
                const response = await changePublished(questionId, changeStatus);

                if (response.status === 201) {
                    message.success("Cập nhật trạng thái bài viết thành công!");
                    // fetchQuestions(); // Tải lại danh sách bài viết sau khi cập nhật trạng thái
                } else {
                    message.error(response.message || "Cập nhật trạng thái thất bại!");
                }
            } else {
                message.error("Không thể thay đổi trạng thái theo hướng này.");
            }

        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        } finally {
            setLoading(false);
        }
    };


    const openModal = (question) => {
        setSelectedQuestion(question);
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
        // fetchQuestions();
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
                Danh Sách Bài Viết
            </Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="ADMIN" key="1">
                    <Button type="primary" onClick={onCreateQuestion}>
                        Tạo Bài Viết
                    </Button>

                    {loading ? (
                        <div className="loading-container">
                            <Spin tip="Đang tải dữ liệu..." size="large" />
                        </div>
                    ) : (
                        <div>
                            <div className="post-grid">
                                {privateCurrentQuestions.map((question) => (
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
                                                    : "Chưa có ngày tạo"}
                                            </Text>
                                            <Paragraph
                                                ellipsis={{ rows: 2, expandable: false }}
                                                className="post-card-paragraph"
                                            >
                                                {question.content}
                                            </Paragraph>
                                            <div className="post-card-actions">
                                                <Button type="primary" onClick={() => handleUpdate(question.id)}>
                                                    Update
                                                </Button>
                                                <Button danger onClick={() => handleDelete(question.id)}>
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
                        <Button onClick={() => setFilterStatus("UNDER_REVIEW")}>UNDER_REVIEW</Button>
                        <Button onClick={() => setFilterStatus("APPROVED")}>APPROVED</Button>
                    </div>
                    {loading ? (
                        <div className="loading-container">
                            <Spin tip="Đang tải dữ liệu..." size="large" />
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
                                                    : "Chưa có ngày tạo"}
                                            </Text>
                                            <Paragraph
                                                ellipsis={{ rows: 2, expandable: false }}
                                                className="post-card-paragraph"
                                            >
                                                {question.content}
                                            </Paragraph>
                                            <div className="post-card-actions">
                                                {/* Thêm select dropdown cho các bài post có trạng thái "PENDING" và "UNDER_REVIEW" */}
                                                {(question.status === "PENDING" || question.status === "UNDER_REVIEW") && (
                                                    <Select
                                                        value={question.status}
                                                        onChange={(value) => handleStatusChange(question.id, value)}
                                                        style={{ width: 120 }}
                                                    >
                                                        <Option value="PENDING">PENDING</Option>
                                                        <Option value="UNDER_REVIEW">UNDER_REVIEW</Option>
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
            // onQuestionCreated={fetchQuestions}
            />
        </div>
    );
};

export default PostPage;
