import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    Upload,
    notification,
    Divider,
    Space,
    Row,
    Col,
    InputNumber
} from 'antd';
import {
    UploadOutlined,
    PlusOutlined,
    RobotOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const CreateBlogModal = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Category options for gym-related content
    const categories = [
        'Gym',
        'Fitness',
        'Bodybuilding',
        'Strength Training',
        'Cardio',
        'Workout Plans',
        'Nutrition',
        'Supplements'
    ];

    // Tag options
    const tags = [
        'News',
        'Tips',
        'Beginner',
        'Advanced',
        'Equipment',
        'Protein',
        'Fat Loss',
        'Muscle Gain',
        'Recovery',
        'Motivation'
    ];

    // Tone options for AI generation
    const tones = [
        'Professional',
        'Casual',
        'Informative',
        'Motivational',
        'Authoritative',
        'Friendly'
    ];

    // Language options for AI generation
    const languages = [
        'English',
        'Spanish',
        'French',
        'German',
        'Italian',
        'Portuguese',
        'Chinese',
        'Japanese',
        'Korean',
        'Vietnamese'
    ];

    const generateAIContent = async () => {
        try {
            const values = form.getFieldsValue();
            const title = values.title;

            if (!title) {
                notification.warning({
                    message: 'Missing Information',
                    description: 'Please enter a title to generate content.',
                });
                return;
            }

            setGenerating(true);

            const generationRequest = {
                topic: title,
                language: values.language || 'English',
                minWords: values.minWords || 300,
                maxWords: values.maxWords || 800,
                tone: values.aiTone || 'Professional',
                additionalInstructions: `Create a blog post about ${title} suitable for a fitness and gym website. Include relevant tips, facts, or advice.`
            };

            const response = await axios.post('http://localhost:9001/api/deal/articles/generate', generationRequest);

            if (response.data && response.data.status === 'success') {
                form.setFieldsValue({
                    content: response.data.content
                });

                notification.success({
                    message: 'Content Generated',
                    description: `AI-generated content added (${response.data.wordCount} words, ${Math.round(response.data.readingTimeMinutes)} min read)`,
                });
            } else {
                throw new Error(response.data?.message || 'Failed to generate content');
            }
        } catch (error) {
            notification.error({
                message: 'Generation Failed',
                description: error.message || 'An error occurred while generating content.',
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Prepare FormData for multipart file upload
            const formData = new FormData();
            formData.append('authorName', values.authorName || 'Health Enthusiast');
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('category', values.category);
            formData.append('tags', values.tags);

            // Append thumbnail files
            if (fileList && fileList.length > 0) {
                fileList.forEach((file, index) => {
                    if (file.originFileObj) {
                        formData.append('thumbnailUrl', file.originFileObj);
                    }
                });
            }

            // Send blog creation request
            const response = await axios.post(
                'http://localhost:9001/api/deal/blogs/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Handle successful response
            notification.success({
                message: 'Success',
                description: 'Blog post created successfully!',
            });

            // Reset form and close modal
            form.resetFields();
            setFileList([]);
            onSuccess();
            onClose();

        } catch (error) {
            // Handle error
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'An error occurred while creating the blog post.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onClose();
    };

    // Handle image upload changes
    const handleUploadChange = ({ fileList: newFileList }) => {
        // Limit to 8 files
        const limitedFileList = newFileList.slice(0, 8);
        setFileList(limitedFileList);
    };

    // Upload button configuration
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Modal
            title="Create New Blog Post"
            visible={visible}
            width={800}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Create Blog
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    authorName: 'Health Enthusiast',
                    aiTone: 'Professional',
                    language: 'English',
                    minWords: 300,
                    maxWords: 800
                }}
            >
                <Form.Item
                    name="authorName"
                    label="Author Name"
                    rules={[{ required: true, message: 'Please enter an author name' }]}
                >
                    <Input placeholder="Enter author name" />
                </Form.Item>

                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter blog title" />
                </Form.Item>

                <Divider>
                    <Space>
                        <RobotOutlined />
                        AI Content Generation
                    </Space>
                </Divider>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="aiTone"
                            label="AI Writing Tone"
                        >
                            <Select placeholder="Select tone">
                                {tones.map(tone => (
                                    <Option key={tone} value={tone}>{tone}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="language"
                            label="Language"
                        >
                            <Select placeholder="Select language">
                                {languages.map(lang => (
                                    <Option key={lang} value={lang}>{lang}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button
                            icon={<RobotOutlined />}
                            onClick={generateAIContent}
                            loading={generating}
                            style={{ marginBottom: '24px', width: '100%' }}
                            type="dashed"
                        >
                            Generate Content
                        </Button>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="minWords"
                            label="Minimum Words"
                        >
                            <InputNumber min={100} max={1000} step={50} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maxWords"
                            label="Maximum Words"
                        >
                            <InputNumber min={200} max={2000} step={50} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: 'Please enter blog content' }]}
                >
                    <TextArea
                        placeholder="Enter blog content or use AI generation"
                        autoSize={{ minRows: 8, maxRows: 16 }}
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select placeholder="Select category">
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tags"
                    label="Tags"
                    rules={[{ required: true, message: 'Please select at least one tag' }]}
                >
                    <Select mode="multiple" placeholder="Select tags">
                        {tags.map(tag => (
                            <Option key={tag} value={tag}>{tag}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="thumbnailUrl"
                    label="Thumbnail Images"
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false} // Prevent automatic upload
                        multiple
                        accept=".jpg,.jpeg,.png,.gif"
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <div style={{ marginTop: 8 }}>
                        <small>Upload up to 8 images. Supported formats: JPG, PNG, GIF</small>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateBlogModal;