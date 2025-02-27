import React, { useEffect, useState } from "react";
import { Typography, Divider, Spin, notification, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { GetAllQuestion } from "../../../serviceToken/ForumService";

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
                        message: "Lỗi",
                        description: response.message || "Không thể tải chi tiết bài viết.",
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

        fetchPostDetail();
    }, [postId]);

    // console.log("data: ", post);

    if (loading) return <Spin size="large" />;
    if (!post) return <Text>Không tìm thấy bài viết.</Text>;

    return (
        <section id="services">
            <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
                <Title level={3}>{post.title}</Title>
                <Text type="secondary">Tác giả: {post.author}</Text>
                <Divider />
                <Paragraph>{post.content}</Paragraph>
                <Divider />
                <Text type="secondary">Từ khóa: {post.tag}</Text>
                <br />
                <Text type="secondary">Danh mục: {post.category?.join(", ")}</Text>
                <Divider />
                {post.questionImage?.length > 0 && (
                    <div>
                        <Title level={5}>Hình ảnh:</Title>
                        {post.questionImage.map((image, index) => (
                            <img
                                key={index}
                                src={image.imageUrl}
                                alt={`Hình ảnh ${index + 1}`}
                                style={{ maxWidth: "100%", marginBottom: "16px" }}
                            />
                        ))}
                    </div>
                )}
                <Button
                    type="primary"
                    style={{ marginTop: "16px" }}
                    onClick={() =>
                        navigate(`/update-question/${postId}`, {
                            state: { post }, // Truyền dữ liệu bài viết qua route
                        })
                    }
                >
                    Update Question
                </Button>
            </div>
        </section>
    );
};

export default YourPostDetailPage;
