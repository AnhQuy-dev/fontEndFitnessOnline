import React, { useEffect, useState } from "react";
import { Typography, Button, Input, Form, message, Modal } from "antd";
import moment from "moment";
import { getDecodedToken, getTokenData } from "../../../../serviceToken/tokenUtils";
import { createComment, deleteComment, GetCommentByQuestionId, updateComment } from "../../../../serviceToken/ForumService";

const { Title, Text, Paragraph } = Typography;

const CreateComment = ({ questionId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeReplyForm, setActiveReplyForm] = useState(null);
    const [mainForm] = Form.useForm();
    const [replyForm] = Form.useForm();
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [activeMenu, setActiveMenu] = useState(null); // Lưu trạng thái nút 3 chấm
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();

    const toggleMenu = (commentId) => {
        setActiveMenu(activeMenu === commentId ? null : commentId); // Đổi trạng thái mở/tắt menu
    };


    // Fetch comments by question ID
    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await GetCommentByQuestionId(questionId, tokenData.access_token);
            if (response && response) {
                // console.log("Fetched comments:", response.data); // Kiểm tra dữ liệu trả về
                const sortedComments = response.sort((a, b) => {
                    // Chuyển `createdAt` từ chuỗi ISO-8601 thành timestamp để so sánh
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA; // Mới nhất trước (giảm dần)
                });

                setComments(sortedComments);
            } else {
                message.error("Comment not found!");
            }
        } catch (error) {
            console.error("API error:", error);
            message.error("An error occurred while loading comments!");
        } finally {
            setLoading(false);
        }
    };


    // Create new comment
    const handleCreateComment = async (values) => {
        const commentData = {
            userId: decotoken.id,
            userName: decotoken.fullName,
            questionId,
            parentCommentId: values.parentCommentId || null,
            content: values.content,
        };
        try {
            const response = await createComment(commentData, tokenData.access_token);
            // console.log("response create comment: ", response);


            if (response && response.status === 200 || response.status === 201) {
                // Reset the appropriate form based on whether it's a reply or main comment
                if (values.parentCommentId) {
                    replyForm.resetFields();
                } else {
                    mainForm.resetFields();
                }
                setActiveReplyForm(null);

                setTimeout(() => {
                    fetchComments();
                }, 3000);

                // Hiển thị thông báo thành công
                message.success("Comment created successfully!");
            } else if (response && response.status === 400) {
                // Xử lý lỗi khi không tìm thấy câu hỏi
                message.error("Question not found!");
            } else if (response && response.status === 401) {
                // Xử lý lỗi khi không tìm thấy bình luận cha
                message.error("Parent Comment Not Found!");
            }
            else if (response && response.status === 402) {
                // Xử lý lỗi khi không tìm thấy bình luận cha
                message.error("Comment contains spam and cannot be accepted.!");
            }
            else {
                // Xử lý các lỗi không mong muốn
                message.error("Unexpected error occurred!");
            }
        } catch (error) {
            console.error("Error creating comment:", error);

            // Xử lý lỗi từ phía client hoặc network
            if (error.response) {
                // Lỗi từ phía server
                message.error(error.response.data.message || "Server error occurred!");
            } else {
                // Lỗi từ phía client
                message.error(error.message || "Network error occurred!");
            }
        }

    };

    const handleEditComment = async (commentId) => {
        const comment = comments.find((c) => c.id === commentId); // Lấy comment cần chỉnh sửa
        if (comment.userId !== decotoken.id || comment.userName !== decotoken.fullName) {
            message.error("You don't have permission to edit this comment!");
            return;
        }
        const updatedCommentData = {
            content: editingContent,
        };

        try {
            const response = await updateComment(commentId, updatedCommentData, tokenData.access_token);
            if (response && response.status === 200) {
                message.success("Comment updated successfully!");
                setEditingCommentId(null); // Đóng form chỉnh sửa
                fetchComments(); // Làm mới danh sách bình luận
            } else if (response && response.status === 400) {
                message.error("Question not found!");
            } else if (response && response.status === 401) {
                message.error("Parent Comment Not Found!");
            } else if (response && response.status === 402) {
                message.error("Comment Cannot Be Updated After 24 Hours!");
            }
            else if (response && response.status === 403) {
                message.error("Comment contains spam and cannot be accepted.!");
            } else {
                message.error("Unexpected error occurred!");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            // Xử lý lỗi từ phía client hoặc network
            if (error.response) {
                // Lỗi từ phía server
                message.error(error.response.data.message || "Server error occurred!");
            } else {
                // Lỗi từ phía client
                message.error(error.message || "Network error occurred!");
            }
        }
    };

    const handleDeleteComment = async (idComment) => {
        const comment = comments.find((c) => c.id === idComment); // Lấy comment cần xóa
        if (comment.userId !== decotoken.id || comment.userName !== decotoken.fullName) {
            message.error("You don't have permission to delete this comment!");
            return;
        }
        try {
            const response = await deleteComment(idComment, tokenData.access_token);

            if (response && response.status === 200) {
                message.success("Comment deleted successfully!");
                // Gọi lại API để cập nhật danh sách bình luận
                fetchComments();
            } else if (response && response.status === 400) {
                message.error("Comment Not Found!");
            } else if (response && response.status === 401) {
                message.error("Comment Cannot Be Updated After 24 Hours!");
            } else {
                // Xử lý lỗi cụ thể nếu có thông tin
                message.error(response || "Failed to delete the comment.");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            if (error.response) {
                // Lỗi từ phía server
                message.error(error.response.data.message || "Server error occurred!");
            } else {
                // Lỗi từ phía client
                message.error(error.message || "Network error occurred!");
            }
        }
    };
    const confirmDelete = (idComment) => {
        Modal.confirm({
            title: "Are you sure you want to delete this comment?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => handleDeleteComment(idComment),
        });
    };

    // Build tree structure for comments
    const buildCommentTree = (commentsList) => {
        const commentMap = {};
        const tree = [];

        // Initialize comment map
        commentsList.forEach((comment) => {
            comment.children = [];
            commentMap[comment.id] = comment;
        });

        // Build the tree
        commentsList.forEach((comment) => {
            if (comment.parentCommentId) {
                const parent = commentMap[comment.parentCommentId];
                if (parent) {
                    parent.children.push(comment);
                }
            } else {
                tree.push(comment);
            }
        });
        // console.log("Built comment tree:", tree); // Log cây bình luận để kiểm tra
        return tree;
    };

    // Render comments recursively
    const renderComments = (commentsList, parentUserName = null, level = 0) => {
        return commentsList.map((comment) => (
            <div
                key={comment.id}
                style={{
                    marginLeft: level === 1 ? 50 : 0,
                    marginBottom: 10,
                    borderBottom: level === 0 ? "1px solid #f0f0f0" : "none",
                    paddingBottom: level === 0 ? 10 : 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                        <Text strong>{comment.userName}</Text>
                        <Paragraph style={{ margin: 0 }}>
                            {parentUserName && parentUserName !== comment.userName && (
                                <Text strong style={{ backgroundColor: "#e6f7ff", padding: "2px 4px", borderRadius: "4px" }}>
                                    {parentUserName}
                                </Text>
                            )} {comment.content}
                        </Paragraph>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "12px", marginTop: "5px" }}>
                            <Text type="secondary">{moment(comment.createdAt, "YYYY-MM-DD HH:mm:ss").fromNow()}</Text>
                            <Button type="link" size="small" style={{ padding: 0 }}>like</Button>
                            <Button type="link" size="small" style={{ padding: 0 }}>dislike</Button>
                            <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setActiveReplyForm(activeReplyForm === comment.id ? null : comment.id)}>reply</Button>
                            {comment.userId === decotoken.id && comment.userName === decotoken.fullName && (
                                <>
                                    <Button
                                        type="link"
                                        size="small"
                                        style={{ padding: 0 }}
                                        onClick={() => toggleMenu(comment.id)}
                                    >
                                        . . .
                                    </Button>
                                    {activeMenu === comment.id && (
                                        <div style={{ display: "inline-block", marginLeft: "0px" }}>

                                            <Button
                                                type="link"
                                                size="small"
                                                style={{ padding: 10 }}
                                                onClick={() => {
                                                    setEditingCommentId(comment.id); // Bắt đầu chỉnh sửa
                                                    setEditingContent(comment.content); // Lấy nội dung hiện tại để chỉnh sửa
                                                }}
                                            >
                                                edit
                                            </Button>

                                            <Button
                                                type="link"
                                                size="small"
                                                style={{ padding: 5 }}
                                                onClick={() => confirmDelete(comment.id)}
                                            >
                                                delete
                                            </Button>

                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {editingCommentId === comment.id && (
                    <div style={{ marginTop: "10px" }}>
                        <Input.TextArea
                            rows={2}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            placeholder="Edit comment content"
                        />
                        <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                            <Button type="primary" size="small" onClick={() => handleEditComment(comment.id)}>
                                Save
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setEditingCommentId(null)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Form trả lời */}
                {activeReplyForm === comment.id && (
                    <div style={{ marginTop: "10px" }}>
                        <Form
                            form={replyForm}
                            layout="inline"
                            style={{ marginTop: "5px" }}
                            onFinish={(values) =>
                                handleCreateComment({ ...values, parentCommentId: comment.id })
                            }
                        >
                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: "Please enter comment content" }]}
                            >
                                <Input placeholder="Reply to this comment" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="small">
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                {/* Render child comments */}
                {comment.children && comment.children.length > 0 && (
                    <div style={{ marginTop: 10 }}>{renderComments(comment.children, comment.userName, level + 1)}</div>
                )}
            </div>
        ));
    };

    useEffect(() => {
        fetchComments();
    }, [questionId]);

    useEffect(() => {
        // console.log("Updated comments state:", comments); // Kiểm tra state comments khi cập nhật
    }, [comments]);

    const commentTree = buildCommentTree(comments);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
            <Title level={3}>Comments</Title>

            {/* Form tạo comment mới */}
            <Form
                form={mainForm}
                onFinish={handleCreateComment}
                layout="vertical"
                style={{ marginBottom: 20 }}>
                <Form.Item
                    name="content"
                    label="Comment content"
                    rules={[{ required: true, message: "Please enter comment content" }]}
                >
                    <Input.TextArea rows={3} placeholder="Enter your comment" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Send comment
                </Button>
            </Form>

            {/* Hiển thị danh sách comment */}
            {commentTree.length > 0 ? renderComments(commentTree) : <Text>No comments yet.</Text>}
        </div>
    );
};

export default CreateComment;


