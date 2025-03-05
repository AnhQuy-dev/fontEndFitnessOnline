import React, { useEffect, useRef, useState } from 'react';
import { Table, notification, Button, Switch, Tabs, Modal, message, Tag } from 'antd';
import moment from 'moment';
import { TabPane } from 'react-bootstrap';
import { getTokenData } from '../../../serviceToken/tokenUtils';

// Import these services or create them as needed
import {
    deleteBlog,
    fetchAllBlogs
} from '../../../serviceToken/BlogService';

// Import modals or create them as needed
import BlogDetailsModal from './BlogDetailsModal';
import CreateBlogModal from './CreateBlogModal';

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const pollingInterval = useRef(null);

    // Fetch blogs from API
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await fetchAllBlogs();
            console.log("blog:", response);

            if (response) {
                setBlogs(response);

            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch blogs.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
        // Poll for updates every 30 seconds
        pollingInterval.current = setInterval(fetchBlogs, 30000);
        return () => clearInterval(pollingInterval.current);
    }, []);

    // Handle row click to show blog details
    const handleRowClick = (record) => {
        setSelectedBlog(record);
        setIsDetailsModalVisible(true);
    };

    // Handle successful blog creation
    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        fetchBlogs();
    };

    // Handle publish status change
    // const handlePublishChange = async (id, newStatus) => {
    //     try {
    //         const response = await changePublishStatus(id, newStatus, tokenData.access_token);
    //         if (response.status === 200) {
    //             notification.success({
    //                 message: 'Success',
    //                 description: `Blog ${newStatus ? 'published' : 'unpublished'} successfully!`,
    //             });
    //             fetchBlogs();
    //         } else {
    //             throw new Error('Failed to update publish status');
    //         }
    //     } catch (error) {
    //         notification.error({
    //             message: 'Error',
    //             description: error.message || 'Failed to change publish status.',
    //         });
    //     }
    // };

    // Handle blog deletion
    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this blog?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await deleteBlog(id);
                    if (response.status === 200) {
                        message.success("Blog deleted successfully!");
                        fetchBlogs();
                    } else {
                        message.error(response.message || "Failed to delete blog!");
                    }
                } catch (error) {
                    message.error("Error occurred while calling API!");
                } finally {
                    setLoading(false);
                }
            },
            onCancel: () => {
                message.info("Delete operation cancelled.");
            },
        });
    };

    // Format content preview by removing Lorem Ipsum
    const formatContentPreview = (content) => {
        if (!content) return "";

        // Get first paragraph that isn't Lorem Ipsum
        const paragraphs = content.split('\n');
        const firstRealParagraph = paragraphs.find(p =>
            !p.includes("Lorem Ipsum") && p.trim().length > 0
        );

        // Return first 100 characters with ellipsis if needed
        return firstRealParagraph
            ? `${firstRealParagraph.substring(0, 100)}${firstRealParagraph.length > 100 ? '...' : ''}`
            : "";
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Author',
            dataIndex: 'authorName',
            key: 'authorName',
        },
        {
            title: 'Content Preview',
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <span>{formatContentPreview(text)}</span>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag color="blue">{category}</Tag>
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => (
                <Tag color="green">{tags}</Tag>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (dateArray) => {
                if (!dateArray) return '';
                const [year, month, day, hour, minute, second] = dateArray;
                return moment(new Date(year, month - 1, day, hour, minute, second)).format('YYYY-MM-DD HH:mm');
            },
        },
        {
            title: 'Published',
            dataIndex: 'isPublished',
            key: 'isPublished',
            // render: (isPublished, record) => (
            //     <Switch
            //         checked={isPublished}
            //         onChange={() => handlePublishChange(record.id, !isPublished)}
            //     />
            // ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record.id);
                    }}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Blog Management</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="All Blogs" key="1">
                    <Button
                        type="primary"
                        onClick={() => setIsCreateModalVisible(true)}
                        style={{ marginBottom: '20px' }}
                    >
                        Create New Blog
                    </Button>
                    <Table
                        dataSource={Array.isArray(blogs) ? blogs : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
                <TabPane tab="Published Blogs" key="2">
                    <Table
                        dataSource={Array.isArray(blogs) ? blogs.filter(blog => blog.isPublished) : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
                <TabPane tab="Drafts" key="3">
                    <Table
                        dataSource={Array.isArray(blogs) ? blogs.filter(blog => !blog.isPublished) : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                        pagination={{ pageSize: 10 }}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                </TabPane>
            </Tabs>

            {/* Blog details modal */}
            <BlogDetailsModal
                visible={isDetailsModalVisible}
                onClose={() => setIsDetailsModalVisible(false)}
                blog={selectedBlog}
            />

            {/* Create blog modal */}
            <CreateBlogModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default BlogAdmin;