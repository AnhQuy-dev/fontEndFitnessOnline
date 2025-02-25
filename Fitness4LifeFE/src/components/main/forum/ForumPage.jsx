import "../../../assets/css/ForumPage.css"; // Custom CSS nếu cần
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Typography, message } from "antd";
import moment from "moment";
import { GetAllQuestion } from "../../../serviceToken/ForumService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const { Title, Paragraph, Text } = Typography;

const ForumPage = () => {
    const [questions, setQuestions] = useState([]); // State lưu danh sách câu hỏi
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const location = useLocation();
    const navigate = useNavigate();
    const tokenData = getTokenData();
    // Lấy category từ URL
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    const category = categoryParam ? decodeURIComponent(categoryParam) : null;

    // Hàm fetch dữ liệu từ API
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion(tokenData.access_token);
            // console.log("API Response Data:", response);

            if (response.status === 200) {
                const allQuestions = response.data;

                // Lọc bài viết có status = APPROVED
                const approvedQuestions = allQuestions.filter(
                    (q) => q.status === "APPROVED"
                );
                // Lọc dữ liệu theo category nếu có
                const filteredQuestions = category
                    ? approvedQuestions.filter(
                        (q) =>
                            q.category?.length > 0 &&
                            q.category.some((cat) => cat.trim() === category.trim())
                    )
                    : approvedQuestions;

                setQuestions(filteredQuestions);
                // console.log("Filtered Questions:", filteredQuestions);
                // message.success("Lấy danh sách bài viết thành công!");
            } else {
                message.error(response.message || "Lấy danh sách thất bại!");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            message.error("Có lỗi xảy ra khi gọi API!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [category]);
    // console.log("questions : ", questions);

    return (
        <section id="services">
            <div className="forum-container">
                <Title level={2} className="forum-title">
                    {category ? `Danh sách bài viết: ${category}` : "Danh Sách Bài Viết"}
                </Title>

                {loading ? (
                    <div className="spinner-container">
                        <Spin tip="Đang tải dữ liệu..." size="large">
                            <div style={{ padding: "50px" }} />
                        </Spin>
                    </div>
                ) : (
                    <div className="forum-list">
                        {questions.length > 0 ? (
                            questions.map((question) => (
                                <div
                                    key={question.id}
                                    className="forum-item"
                                    onClick={() => navigate(`/forum/${question.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="forum-image">
                                        <img
                                            src={
                                                question.questionImage?.length > 0
                                                    ? question.questionImage[0].imageUrl
                                                    : "https://via.placeholder.com/200x150?text=No+Image"
                                            }
                                            alt={question.title}
                                        />
                                    </div>
                                    <div className="forum-content">
                                        <Title level={4} className="forum-title-item">
                                            {question.title}
                                        </Title>
                                        <Text type="secondary" className="forum-author">
                                            {question.author} -{" "}
                                            {question.createdAt
                                                ? moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")
                                                : "Chưa có ngày tạo"}
                                        </Text>
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {question.content}
                                        </Paragraph>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <Text type="secondary">Không có bài viết nào phù hợp.</Text>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ForumPage;
