import React, { useEffect, useRef, useState } from 'react';
import { Table, notification, Button, Switch, Tabs, Modal, message } from 'antd';
import PromotionDetailsModal from './PromotionDetailsModal';
import CreatePromotionModal from './CreatePromotionModal';
import moment from 'moment';
import SendPromotionCodeModal from './SendPromotionCodeModal';
import SendPromotionToUserModal from './SendPromotionToUserModal ';
import CreatePromotionInJsonModa from './CreatePromotionInJsonModa';
import { TabPane } from 'react-bootstrap';
import { changestatus, DeletePromotions, getAllPromotions, getAllPromotionsInJson } from '../../../serviceToken/PromotionService';
import { getDecodedToken, getTokenData } from '../../../serviceToken/tokenUtils';

const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]); // Quản lý danh sách khuyến mãi
    const [promotionsJson, setPromotionsJson] = useState([]); // Quản lý danh sách JSON khuyến mãi
    const [loading, setLoading] = useState(false); // Quản lý trạng thái tải dữ liệu
    const [loadingJson, setLoadingJson] = useState(false); // Quản lý trạng thái tải JSON
    const [selectedPromotion, setSelectedPromotion] = useState(null); // Lưu dữ liệu khuyến mãi được chọn
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Trạng thái hiển thị modal tạo mới
    const [isSendCodeModalVisible, setIsSendCodeModalVisible] = useState(false);
    const [isSendCodeToUserModalVisible, setIsSendCodeToUserModalVisible] = useState(false);
    const pollingInterval = useRef(null); // Dùng để lưu interval polling
    const [isCreatePromotionInJsonModaVisible, setIsCreatePromotionInJsonModaVisible] = useState(false); // Trạng thái hiển thị modal tạo mới
    const tokenData = getTokenData();//tokenData.access_token
    // Hàm gọi API lấy danh sách khuyến mãi
    const fetchPromotions = async () => {
        setLoading(true);
        try {

            const response = await getAllPromotions(tokenData.access_token);
            // console.log("t", response);
            if (response && response.data) {
                setPromotions(response.data);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch promotions.',
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

    // Hàm gọi API lấy danh sách khuyến mãi JSON
    const fetchPromotionsJson = async () => {
        setLoadingJson(true);
        try {
            const response = await getAllPromotionsInJson(tokenData.access_token);
            console.log("data json:", response);

            if (response.status === 200) {
                setPromotionsJson(response.data);

            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch JSON promotions.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoadingJson(false);
        }
    };
    useEffect(() => {
        fetchPromotionsJson(); // Lấy danh sách JSON khuyến mãi
        fetchPromotions();
        pollingInterval.current = setInterval(fetchPromotions, 10000); // Tự động gọi lại API mỗi 30 giây
        return () => clearInterval(pollingInterval.current); // Dọn dẹp interval khi unmount
    }, []);

    // Hàm xử lý khi nhấn vào Title hoặc Description
    const handleRowClick = (record) => {
        setSelectedPromotion(record); // Lưu dữ liệu khuyến mãi được chọn
        setIsModalVisible(true); // Hiển thị modal
    };

    // Hàm xử lý khi tạo mới thành công
    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false); // Đóng modal tạo mới
        fetchPromotions(); // Tải lại danh sách khuyến mãi
    };

    const handleCreateJsonCodeSuccess = () => {
        setIsCreatePromotionInJsonModaVisible(false); // Đóng modal tạo mới
        fetchPromotionsJson(); // Tải lại danh sách khuyến mãi
    };


    // Hàm xử lý thay đổi trạng thái
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await changestatus(id, newStatus, tokenData.access_token);
            if (response.status === 201 || response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: `Status changed to ${newStatus ? 'Active' : 'Inactive'} successfully!`,
                });
                fetchPromotions(); // Làm mới danh sách sau khi cập nhật thành công
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message || 'Failed to change status.',
            });
        }
    };

    const handleDelete = async (id) => {
        // Hiển thị hộp thoại xác nhận xóa
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa khuyến mãi này?',
            content: 'Khuyến mãi này sẽ bị xóa vĩnh viễn.',
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await DeletePromotions(id, tokenData.access_token);  // Gọi API xóa khuyến mãi
                    if (response.status === 200) {
                        message.success("Xóa thành công!");
                        fetchPromotions();  // Tải lại danh sách khuyến mãi sau khi xóa
                    } else {
                        message.error(response.message || "Xóa thất bại!");
                    }
                } catch (error) {
                    message.error("Có lỗi xảy ra khi gọi API!");
                } finally {
                    setLoading(false);
                }
            },
            onCancel: () => {
                message.info("Hủy thao tác xóa.");
            },
        });
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <span style={{ cursor: 'pointer' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <span style={{ cursor: 'pointer' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Discount Value',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value) => `₫ ${value}`,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatusChange(record.id, !isActive)}
                />
            ),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="danger"
                    onClick={() => handleDelete(record.id)}  // Truyền id của khuyến mãi cần xóa
                >
                    Delete
                </Button>
            ),
        },

    ];

    const jsonColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Discount Value',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value) => `₫ ${value.toFixed(2)}`, // Hiển thị định dạng tiền tệ
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
        },
    ];


    return (
        <div style={{ padding: '20px' }}>
            <h2>Promotion Management</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Promotion List" key="1">
                    <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: '20px' }}>
                        Create Promotion
                    </Button>
                    <Button type="default" onClick={() => setIsSendCodeModalVisible(true)}>
                        Send Code to All Users
                    </Button>
                    <Button type="default" onClick={() => setIsSendCodeToUserModalVisible(true)}>
                        Send Code to User
                    </Button>
                    <Table
                        dataSource={Array.isArray(promotions) ? promotions : []}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        bordered
                    />
                </TabPane>
                <TabPane tab="Promotions in JSON" key="2">
                    <Button type="primary" onClick={() => setIsCreatePromotionInJsonModaVisible(true)} style={{ marginBottom: '20px' }}>
                        generateCodeFromPoints
                    </Button>
                    <Table
                        dataSource={Array.isArray(promotionsJson) ? promotionsJson : []}
                        columns={jsonColumns}
                        rowKey="id"
                        loading={loadingJson}
                        bordered
                    />
                </TabPane>
            </Tabs>
            {/* Modal hiển thị chi tiết khuyến mãi */}
            <PromotionDetailsModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                promotion={selectedPromotion}
            />
            {/* Modal tạo mới khuyến mãi */}
            <CreatePromotionModal
                visible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
            />
            <CreatePromotionInJsonModa
                visible={isCreatePromotionInJsonModaVisible}
                onClose={() => setIsCreatePromotionInJsonModaVisible(false)}
                onSuccess={handleCreateJsonCodeSuccess}
            />
            {/* Modal gửi mã khuyến mãi */}
            <SendPromotionCodeModal
                visible={isSendCodeModalVisible}
                onClose={() => setIsSendCodeModalVisible(false)}
            />
            {/* Modal gửi mã cho một người dùng */}
            <SendPromotionToUserModal
                visible={isSendCodeToUserModalVisible}
                onClose={() => setIsSendCodeToUserModalVisible(false)}
            />
        </div>
    );
};

export default PromotionPage;
