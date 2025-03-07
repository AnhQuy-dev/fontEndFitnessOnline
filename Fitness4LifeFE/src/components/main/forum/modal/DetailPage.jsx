import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, message, Button, Card, Avatar, Image, Row, Col, Divider, Space, Tag, Tooltip } from "antd";
import {
    LikeOutlined, LikeFilled,
    DislikeOutlined, DislikeFilled,
    EyeOutlined,
    UserOutlined,
    CalendarOutlined,
    TagOutlined
} from '@ant-design/icons';
import moment from "moment";
import CreateComment from "../process/CreateComment";
import { getQuestionById, incrementViewCount, voteQuestion } from "../../../../serviceToken/ForumService";
import { getDecodedToken, getTokenData } from "../../../../serviceToken/tokenUtils";

const { Title, Paragraph, Text } = Typography;

const DetailPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const tokenData = getTokenData();
    const decotoken = getDecodedToken();

    const [userVoteState, setUserVoteState] = useState({
        hasLiked: false,
        hasDisliked: false,
    });

    const fetchQuestionDetails = async () => {
        try {
            setLoading(true);
            const response = await getQuestionById(id, tokenData.access_token);

            if (response && response.data) {
                if (decotoken && decotoken.id) {
                    await incrementViewCount(id, decotoken.id, tokenData.access_token);
                }
                setQuestion(response.data);

                const userVote = response.data.votes.find(v => v.userId === decotoken.id);
                if (userVote) {
                    setUserVoteState({
                        hasLiked: userVote.voteType === "UPVOTE",
                        hasDisliked: userVote.voteType === "DOWNVOTE",
                    });
                }
            } else {
                message.error("Post not found!");
            }
        } catch (error) {
            message.error("Error loading post details!");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (voteType) => {
        if (!decotoken || !decotoken.id) {
            message.error("Please login to use this feature!");
            return;
        }

        try {
            let updatedQuestion = { ...question };

            if (voteType === "UPVOTE") {
                if (userVoteState.hasLiked) {
                    updatedQuestion.upvote -= 1;
                    setUserVoteState({ hasLiked: false, hasDisliked: false });
                } else {
                    if (userVoteState.hasDisliked) {
                        updatedQuestion.downVote -= 1;
                    }
                    updatedQuestion.upvote += 1;
                    setUserVoteState({ hasLiked: true, hasDisliked: false });
                }
            } else if (voteType === "DOWNVOTE") {
                if (userVoteState.hasDisliked) {
                    updatedQuestion.downVote -= 1;
                    setUserVoteState({ hasLiked: false, hasDisliked: false });
                } else {
                    if (userVoteState.hasLiked) {
                        updatedQuestion.upvote -= 1;
                    }
                    updatedQuestion.downVote += 1;
                    setUserVoteState({ hasLiked: false, hasDisliked: true });
                }
            }

            const response = await voteQuestion(id, voteType, decotoken.id, tokenData.access_token);

            if (response === "Vote successfully handled") {
                setQuestion(updatedQuestion);
            } else {
                message.error("Error while voting!");
            }
        } catch (error) {
            message.error("Error while voting!");
        }
    };

    useEffect(() => {
        fetchQuestionDetails();
    }, [id]);

    if (loading || !question) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin tip="Loading post details..." size="large" />
            </div>
        );
    }

    return (
        <section style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: '20px' }} id="services">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <Card
                    bordered={false}
                    style={{
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Header Section */}
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Title level={2} style={{ marginBottom: '16px' }}>{question.title}</Title>
                            <Space size={[0, 8]} wrap>
                                <Space>
                                    <Avatar icon={<UserOutlined />} />
                                    <Text strong>{question.author}</Text>
                                </Space>
                                <Divider type="vertical" />
                                <Space>
                                    <CalendarOutlined />
                                    <Text type="secondary">
                                        {moment(question.createdAt, "YYYY-MM-DD HH:mm:ss").format("LLL")}
                                    </Text>
                                </Space>
                                <Divider type="vertical" />
                                <Space>
                                    <TagOutlined />
                                    {question.category && question.category.map((cat, index) => (
                                        <Tag key={index} color="blue">{cat}</Tag>
                                    ))}
                                </Space>
                            </Space>
                        </div>

                        {/* Content Section */}
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                            {question.content}
                        </Paragraph>

                        {/* Images Section */}
                        {question.questionImage && question.questionImage.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <Row gutter={[16, 16]}>
                                    {question.questionImage.map((image, index) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                            <Image
                                                src={image.imageUrl}
                                                alt={`Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {/* Interaction Section */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '20px',
                            padding: '16px',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <Space size="large">
                                <Tooltip title={userVoteState.hasLiked ? "Remove like" : "Like"}>
                                    <Button
                                        type={userVoteState.hasLiked ? "primary" : "default"}
                                        icon={userVoteState.hasLiked ? <LikeFilled /> : <LikeOutlined />}
                                        onClick={() => handleVote("UPVOTE")}
                                    >
                                        {question.upvote}
                                    </Button>
                                </Tooltip>
                                <Tooltip title={userVoteState.hasDisliked ? "Remove dislike" : "Dislike"}>
                                    <Button
                                        danger={userVoteState.hasDisliked}
                                        icon={userVoteState.hasDisliked ? <DislikeFilled /> : <DislikeOutlined />}
                                        onClick={() => handleVote("DOWNVOTE")}
                                    >
                                        {question.downVote}
                                    </Button>
                                </Tooltip>
                            </Space>
                            <Tooltip title="Views">
                                <Space>
                                    <EyeOutlined />
                                    <Text>{question.viewCount}</Text>
                                </Space>
                            </Tooltip>
                        </div>
                    </Space>
                </Card>

                {/* Comments Section */}
                <Card
                    style={{
                        marginTop: '20px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    bordered={false}
                >
                    <CreateComment questionId={id} />
                </Card>
            </div>
        </section>
    );
};

export default DetailPage;
