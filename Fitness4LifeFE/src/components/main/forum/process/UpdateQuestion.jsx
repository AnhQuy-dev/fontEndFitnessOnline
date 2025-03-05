import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Upload,
    Typography,
    notification,
    Spin,
    Select,
    Space,
    Card,
    Row,
    Col,
    Divider,
    Badge
} from 'antd';
import {
    UploadOutlined,
    EditOutlined,
    SaveOutlined,
    RollbackOutlined,
    PictureOutlined,
    TagsOutlined,
    FileTextOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getTokenData } from '../../../../serviceToken/tokenUtils';
import { updateQuestion } from '../../../../serviceToken/ForumService';
import '../../../../assets/css/updateQuestion.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Add categoryOptions constant
const categoryOptions = [
    { value: "FORUM_POLICY", label: "Các Chính Sách Diễn Đàn Thể Hình Vui" },
    { value: "FORUM_RULES", label: "Nội Quy Diễn Đàn" },
    { value: "MALE_FITNESS_PROGRAM", label: "Giáo Án Fitness Nam" },
    { value: "FEMALE_FITNESS_PROGRAM", label: "Giáo Án Fitness Nữ" },
    { value: "GENERAL_FITNESS_PROGRAM", label: "Giáo án Thể Hình" },
    { value: "FITNESS_QA", label: "Hỏi Đáp Thể Hình" },
    { value: "POSTURE_CORRECTION", label: "Sửa Tư Thế Kỹ Thuật Tập Luyện" },
    { value: "NUTRITION_EXPERIENCE", label: "Kinh Nghiệm Dinh Dưỡng" },
    { value: "SUPPLEMENT_REVIEW", label: "Review Thực Phẩm Bổ Sung" },
    { value: "WEIGHT_LOSS_QA", label: "Hỏi Đáp Giảm Cân - Giảm Mỡ" },
    { value: "MUSCLE_GAIN_QA", label: "Hỏi Đáp Tăng Cơ - Tăng Cân" },
    { value: "TRANSFORMATION_JOURNAL", label: "Nhật Ký Thay Đổi" },
    { value: "FITNESS_CHATS", label: "Tán Gẫu Liên Quan Fitness" },
    { value: "TRAINER_DISCUSSION", label: "HLV Thể Hình - Trao Đổi Công Việc" },
    { value: "NATIONAL_GYM_CLUBS", label: "CLB Phòng Gym Toàn Quốc" },
    { value: "FIND_WORKOUT_BUDDY", label: "Tìm Bạn Tập Cùng - Team Workout" },
    { value: "SUPPLEMENT_MARKET", label: "Mua Bán Thực Phẩm Bổ Sung" },
    { value: "EQUIPMENT_ACCESSORIES", label: "Dụng Cụ - Phụ Kiện Tập Luyện" },
    { value: "GYM_TRANSFER", label: "Sang Nhượng Phòng Tập" },
    { value: "MMA_DISCUSSION", label: "Võ Thuật Tổng Hợp MMA" },
    { value: "CROSSFIT_DISCUSSION", label: "Cross Fit" },
    { value: "POWERLIFTING_DISCUSSION", label: "Powerlifting" },
];

const UpdateQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const tokenData = getTokenData();

    useEffect(() => {
        if (location.state?.post) {
            const { post } = location.state;
            const initialCategories = Array.isArray(post.category) ? post.category : [post.category];
            setSelectedCategories(initialCategories);

            form.setFieldsValue({
                title: post.title,
                content: post.content,
                tag: post.tag,
                category: initialCategories,
            });
            if (post.questionImage) {
                setImageList(post.questionImage.map(img => ({
                    uid: img.id,
                    url: img.imageUrl,
                    status: 'done'
                })));
            }
        }
    }, [location.state, form]);

    // Xử lý thay đổi category
    const handleCategoryChange = (newValues) => {
        const lastSelected = newValues[newValues.length - 1];
        const wasSelected = selectedCategories.includes(lastSelected);

        let updatedCategories;
        if (wasSelected) {
            // Nếu category đã được chọn trước đó, loại bỏ nó
            updatedCategories = selectedCategories.filter(cat => cat !== lastSelected);
        } else {
            // Nếu là category mới, thêm vào
            updatedCategories = [...selectedCategories, lastSelected];
        }

        setSelectedCategories(updatedCategories);
        form.setFieldsValue({ category: updatedCategories });

        // Log để debug
        console.log('Category changed:', {
            newValues,
            lastSelected,
            wasSelected,
            updatedCategories
        });
    };

    // Xử lý khi người dùng xóa ảnh
    const handleRemoveImage = (file) => {
        if (file.uid) {
            setDeletedImageIds((prevIds) => [...prevIds, file.uid]);
        }
        setImageList((prevList) => prevList.filter(item => item.uid !== file.uid));
    };
    // console.log("deletedImageIds: ", deletedImageIds);

    const handleUpdate = async (values) => {
        try {
            setLoading(true);
            const questionId = location.state?.post?.id;
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('tag', values.tag);
            formData.append('category', values.category);
            formData.append('deleteImageUrl', deletedImageIds);

            // Log FormData entries
            console.log('FormData being sent:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Log image files if any
            if (values.images) {
                console.log('Images to upload:', values.images.fileList);
                values.images.fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('imageQuestionUrl', file.originFileObj);
                        console.log('Adding image:', file.name);
                    }
                });
            }

            const response = await updateQuestion(questionId, formData, tokenData.access_token);
            console.log('API Response:', response);

            if (response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: 'Question updated successfully!',
                });
                navigate('/profile/your-posts');
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to update question',
                });
            }
        } catch (error) {
            console.error('Update Error:', error);
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Updating your question..." />
            </div>
        );
    }

    return (
        <div className="update-question-container">
            <Row justify="center">
                <Col span={24}>
                    <Card className="header-card">
                        <Badge.Ribbon text="Edit Mode" color="#4b6cb7">
                            <Title level={2} className="page-title">
                                <EditOutlined className="title-icon" /> Update Question
                            </Title>
                            <Text className="page-subtitle">
                                Enhance your question with more details and make it even better
                            </Text>
                        </Badge.Ribbon>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} className="main-content">
                <Col xs={24} lg={16}>
                    <Card className="form-card main-form">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleUpdate}
                            className="custom-form"
                        >
                            <div className="form-section">
                                <Space className="section-header">
                                    <FileTextOutlined className="section-icon" />
                                    <Title level={4}>Question Content</Title>
                                </Space>

                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[{ required: true, message: 'Please input the title!' }]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="Enter a clear, specific title for your question"
                                        className="custom-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Content"
                                    name="content"
                                    rules={[{ required: true, message: 'Please input the content!' }]}
                                >
                                    <TextArea
                                        className="custom-textarea"
                                        placeholder="Describe your question in detail..."
                                        rows={8}
                                    />
                                </Form.Item>
                            </div>

                            <Divider />

                            <div className="form-section">
                                <Space className="section-header">
                                    <TagsOutlined className="section-icon" />
                                    <Title level={4}>Categories & Tags</Title>
                                </Space>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Tags"
                                            name="tag"
                                            rules={[{ required: true, message: 'Please add at least one tag!' }]}
                                        >
                                            <Select
                                                mode="tags"
                                                placeholder="Add relevant tags"
                                                className="custom-select"
                                            >
                                                <Option value="fitness">Fitness</Option>
                                                <Option value="health">Health</Option>
                                                <Option value="workout">Workout</Option>
                                                <Option value="nutrition">Nutrition</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Category"
                                            name="category"
                                            rules={[{ required: true, message: 'Please select a category!' }]}
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Select categories"
                                                className="custom-select"
                                                optionLabelProp="label"
                                                value={selectedCategories}
                                                onChange={handleCategoryChange}
                                            >
                                                {categoryOptions.map(option => (
                                                    <Option
                                                        key={option.value}
                                                        value={option.value}
                                                        label={option.label}
                                                    >
                                                        <Space>
                                                            <Text>{option.label}</Text>
                                                        </Space>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div className="form-section">
                                <Space className="section-header">
                                    <PictureOutlined className="section-icon" />
                                    <Title level={4}>Images</Title>
                                </Space>

                                <Form.Item name="images" className="upload-section">
                                    <Upload
                                        listType="picture-card"
                                        fileList={imageList}
                                        onChange={({ fileList }) => setImageList(fileList)}
                                        onRemove={handleRemoveImage} // Thêm sự kiện xóa ảnh
                                        beforeUpload={() => false}
                                        multiple
                                        className="custom-upload"
                                    >
                                        <div className="upload-button">
                                            <UploadOutlined className="upload-icon" />
                                            <div>Upload Images</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </div>

                            <div className="form-actions">
                                <Button
                                    type="default"
                                    size="large"
                                    icon={<RollbackOutlined />}
                                    onClick={() => navigate('/your-posts')}
                                    className="cancel-button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SaveOutlined />}
                                    htmlType="submit"
                                    loading={loading}
                                    className="submit-button"
                                >
                                    Update Question
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="form-card sidebar-card">
                        <Title level={4}>
                            <AppstoreOutlined /> Guidelines
                        </Title>
                        <div className="guidelines-content">
                            <div className="guideline-item">
                                <Title level={5}>Title</Title>
                                <Text type="secondary">Make it specific and clear to help others understand your question quickly.</Text>
                            </div>
                            <div className="guideline-item">
                                <Title level={5}>Content</Title>
                                <Text type="secondary">Provide detailed information and context about your question.</Text>
                            </div>
                            <div className="guideline-item">
                                <Title level={5}>Tags</Title>
                                <Text type="secondary">Add relevant tags to help categorize and find your question easily.</Text>
                            </div>
                            <div className="guideline-item">
                                <Title level={5}>Images</Title>
                                <Text type="secondary">Add clear, relevant images to better illustrate your question.</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UpdateQuestion;
