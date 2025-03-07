import React, { useEffect, useRef, useState } from 'react';
import { Table, notification, Button, Switch, Tabs, Modal, message, Tag, Input, Select, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { TabPane } from 'react-bootstrap';

// Import these services or create them as needed
import {
    deleteBlog,
    fetchAllBlogs,
    changePublishedStatus
} from '../../../serviceToken/BlogService';

// Import modals or create them as needed
import BlogDetailsModal from './BlogDetailsModal';
import CreateBlogModal from './CreateBlogModal';

const { Option } = Select;

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const pollingInterval = useRef(null);

    // Fetch blogs from API
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await fetchAllBlogs();
            console.log("blog:", response);

            if (response) {
                setBlogs(response);
                setFilteredBlogs(response);
                // Extract unique tags and categories for filters
                extractFiltersFromBlogs(response);
                // Clear selected row keys after fetching
                setSelectedRowKeys([]);
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

    // Extract unique tags and categories from blogs
    const extractFiltersFromBlogs = (blogs) => {
        if (!Array.isArray(blogs)) return;

        // Extract unique categories
        const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
        setAvailableCategories(categories);

        // Extract unique tags (assuming tags are stored as a comma-separated string)
        const allTags = blogs
            .map(blog => blog.tags)
            .filter(Boolean)
            .reduce((acc, tagsString) => {
                // If tags are stored as a string, split them; otherwise, handle as an array
                const tagList = typeof tagsString === 'string' 
                    ? tagsString.split(',').map(tag => tag.trim())
                    : Array.isArray(tagsString) ? tagsString : [tagsString];
                return [...acc, ...tagList];
            }, []);
        
        const uniqueTags = [...new Set(allTags)];
        setAvailableTags(uniqueTags);
    };

    useEffect(() => {
        fetchBlogs();
        // Poll for updates every 30 seconds
        pollingInterval.current = setInterval(fetchBlogs, 30000);
        return () => clearInterval(pollingInterval.current);
    }, []);

    // Apply filters when search, tags, or categories change
    useEffect(() => {
        applyFilters();
    }, [searchTitle, selectedTags, selectedCategories, blogs]);

    // Apply all filters to blogs
    const applyFilters = () => {
        let filtered = [...blogs];

        // Filter by title
        if (searchTitle) {
            filtered = filtered.filter(blog => 
                blog.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
        }

        // Filter by categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(blog => 
                selectedCategories.includes(blog.category)
            );
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(blog => {
                // If tags are stored as a string, split them; otherwise, handle as an array
                const blogTags = typeof blog.tags === 'string'
                    ? blog.tags.split(',').map(tag => tag.trim())
                    : Array.isArray(blog.tags) ? blog.tags : [blog.tags];
                
                return selectedTags.some(tag => blogTags.includes(tag));
            });
        }

        setFilteredBlogs(filtered);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        applyFilters();
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTitle('');
        setSelectedTags([]);
        setSelectedCategories([]);
        setFilteredBlogs(blogs);
    };

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
    const handlePublishChange = async (id, newStatus) => {
        try {
            const response = await changePublishedStatus(id, newStatus);
            if (response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: `Blog ${newStatus ? 'published' : 'unpublished'} successfully!`,
                });
                fetchBlogs();
            } else {
                throw new Error('Failed to update publish status');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to change publish status.',
            });
        }
    };

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

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning("Please select blogs to delete");
            return;
        }

        Modal.confirm({
            title: `Are you sure you want to delete ${selectedRowKeys.length} blog(s)?`,
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    setLoading(true);
                    // Use Promise.all to delete multiple blogs concurrently
                    await Promise.all(
                        selectedRowKeys.map(id => deleteBlog(id))
                    );
                    message.success(`${selectedRowKeys.length} blog(s) deleted successfully!`);
                    fetchBlogs();
                } catch (error) {
                    message.error("Error occurred while deleting blogs");
                } finally {
                    setLoading(false);
                }
            },
            onCancel: () => {
                message.info("Bulk delete operation cancelled.");
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

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
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
                <span>
                    {typeof tags === 'string' 
                        ? tags.split(',').map(tag => (
                            <Tag color="green" key={tag.trim()}>
                                {tag.trim()}
                            </Tag>
                          ))
                        : <Tag color="green">{tags}</Tag>
                    }
                </span>
            ),
        },
        {
            title: 'Published',
            dataIndex: 'isPublished',
            key: 'isPublished',
            render: (isPublished, record) => (
                <Switch
            checked={isPublished}
            onChange={(checked, e) => {
                // In Ant Design Switch, the event is the second parameter
                if (e) e.stopPropagation();
                handlePublishChange(record.id, checked);
            }}
        />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="danger"
                    style={{ 
                        height: 40, 
                        borderRadius: "6px",
                        backgroundColor: "#ff4d4f",
                        borderColor: "#FF6600"
                    }}     
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
            
            {/* Filter and Search Section */}
            <div style={{ marginBottom: '20px', background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Input
                            placeholder="Search by title"
                            value={searchTitle}
                            onChange={handleSearchChange}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filter by category"
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            allowClear
                        >
                            {availableCategories.map(category => (
                                <Option key={category} value={category}>{category}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Filter by tags"
                            value={selectedTags}
                            onChange={setSelectedTags}
                            allowClear
                        >
                            {availableTags.map(tag => (
                                <Option key={tag} value={tag}>{tag}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={4} lg={4}>
                        <Space>
                            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                                Search
                            </Button>
                            <Button onClick={handleResetFilters}>
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>
            
            {/* Action Buttons */}
            <div style={{ marginBottom: '20px' }}>
                {selectedRowKeys.length > 0 && (
                    <Button 
                        type="danger" 
                        onClick={handleBulkDelete}
                        style={{ 
                            height: 40, 
                            borderRadius: "6px",
                            backgroundColor: "#ff4d4f",
                            borderColor: "#FF6600"
                        }}                    >
                        Delete Selected ({selectedRowKeys.length})
                    </Button>
                )}

                <Button
style={{ 
    height: 40, 
    borderRadius: "6px",
    backgroundColor: "#FF6600",
    borderColor: "#FF6600"
}}                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Create New Blog
                </Button>
            </div>

            <Tabs defaultActiveKey="1">
                <TabPane tab="All Blogs" key="1">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredBlogs) ? filteredBlogs : []}
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
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredBlogs) ? filteredBlogs.filter(blog => blog.isPublished) : []}
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
                        rowSelection={rowSelection}
                        dataSource={Array.isArray(filteredBlogs) ? filteredBlogs.filter(blog => !blog.isPublished) : []}
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