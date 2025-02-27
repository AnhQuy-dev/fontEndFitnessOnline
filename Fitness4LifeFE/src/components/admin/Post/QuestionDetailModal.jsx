import React from "react";
import { Modal, Typography, Image, Divider } from "antd";
import moment from "moment";

const { Title, Paragraph, Text } = Typography;

const QuestionDetailModal = ({ isOpen, onClose, question }) => {
    return (
        <Modal
            title={null} // Bỏ tiêu đề mặc định của Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
            bodyStyle={{ padding: "20px" }}
        >
            {question && (
                <div className="question-detail">
                    {/* Tiêu đề bài viết */}
                    <Title level={2} className="question-title">
                        {question.title}
                    </Title>

                    {/* Thông tin tác giả và ngày tạo */}
                    <div className="question-meta">
                        <Text strong>Tác giả:</Text> {question.author} &nbsp;|&nbsp;
                        <Text type="secondary" className="forum-author">
                            {question.createdAt
                                ? moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")
                                : "Chưa có ngày tạo"}
                        </Text>
                    </div>

                    {/* Chủ đề, thẻ, và danh mục */}
                    <div className="question-category">
                        <Text strong>Thẻ:</Text> {question.tag} <br />
                        <Text strong>Danh mục:</Text> {question.category}
                    </div>

                    <Divider />

                    {/* Nội dung bài viết */}
                    <div className="question-content">
                        <Paragraph>{question.content}</Paragraph>
                    </div>

                    {/* Hình ảnh */}
                    {question.questionImage?.length > 0 && (
                        <div className="question-image">
                            <Image
                                src={question.questionImage[0].imageUrl}
                                alt="Question"
                                style={{ marginTop: "10px", maxWidth: "100%" }}
                            />
                        </div>
                    )}

                    <Divider />

                    {/* Số liệu bài viết */}
                    <div className="question-stats">
                        <Text strong>Lượt xem:</Text> {question.viewCount} &nbsp;|&nbsp;
                        <Text strong>Upvotes:</Text> {question.upvote} &nbsp;|&nbsp;
                        <Text strong>Downvotes:</Text> {question.downVote}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default QuestionDetailModal;
