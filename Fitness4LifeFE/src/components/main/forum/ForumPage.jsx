import "../../../assets/css/ForumPage.css"; // Custom CSS if needed
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Typography, message } from "antd";
import moment from "moment";
import { GetAllQuestion } from "../../../serviceToken/ForumService";
import { getTokenData } from "../../../serviceToken/tokenUtils";

const { Title, Paragraph, Text } = Typography;

const ForumPage = () => {
    const [questions, setQuestions] = useState([]); // State to store questions list
    const [loading, setLoading] = useState(false); // Loading state
    const location = useLocation();
    const navigate = useNavigate();
    const tokenData = getTokenData();
    // Get category from URL
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    const category = categoryParam ? decodeURIComponent(categoryParam) : null;

    // Function to fetch data from API
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await GetAllQuestion(tokenData.access_token);
            // console.log("API Response Data:", response);

            if (response.status === 200) {
                const allQuestions = response.data;

                // Filter posts with status = APPROVED
                const approvedQuestions = allQuestions.filter(
                    (q) => q.status === "APPROVED"
                );
                // Filter data by category if exists
                const filteredQuestions = category
                    ? approvedQuestions.filter(
                        (q) =>
                            q.category?.length > 0 &&
                            q.category.some((cat) => cat.trim() === category.trim())
                    )
                    : approvedQuestions;

                setQuestions(filteredQuestions);
                // console.log("Filtered Questions:", filteredQuestions);
                // message.success("Successfully retrieved posts!");
            } else {
                message.error(response.message || "Failed to retrieve posts!");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            message.error("An error occurred while calling the API!");
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
                    {category ? `Posts List: ${category}` : "Posts List"}
                </Title>

                {loading ? (
                    <div className="spinner-container">
                        <Spin tip="Loading data..." size="large">
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
                                    onClick={() => navigate(`/forums/forum/post/${question.id}`)}
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
                                                : "No creation date"}
                                        </Text>
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {question.content}
                                        </Paragraph>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <Text type="secondary">No matching posts found.</Text>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ForumPage;
