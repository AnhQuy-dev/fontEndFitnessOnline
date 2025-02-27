import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';

const PromotionDetailsModal = ({ visible, onClose, promotion }) => {
    return (
        <Modal
            title="Promotion Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            width="60%" // Mở rộng modal
        >
            {promotion && (
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Title">{promotion.title}</Descriptions.Item>
                    <Descriptions.Item label="Description">{promotion.description}</Descriptions.Item>
                    <Descriptions.Item label="Discount Type">
                        {promotion.discountType.map((type, index) => (
                            <Tag color="blue" key={index}>{type}</Tag>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Discount Value">₫ {promotion.discountValue}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">
                        {promotion.startDate ? moment(promotion.startDate).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Date">
                        {promotion.endDate ? moment(promotion.endDate).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Active">
                        <Tag color={promotion.isActive ? 'green' : 'red'}>
                            {promotion.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer Type">
                        {promotion.customerType.map((type, index) => (
                            <Tag color="gold" key={index}>{type}</Tag>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Applicable Services">
                        {promotion.applicableService.map((service, index) => (
                            <Tag color="cyan" key={index}>{service}</Tag>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Min Value">₫ {promotion.minValue}</Descriptions.Item>
                    <Descriptions.Item label="Created Date">
                        {promotion.createdDate ? moment(promotion.createdDate).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created By">{promotion.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Package Name">
                        {promotion.packageName.map((pkg, index) => (
                            <Tag color="purple" key={index}>{pkg}</Tag>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Code">{promotion.code}</Descriptions.Item>
                    <Descriptions.Item label="Points">{promotion.points}</Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
};

export default PromotionDetailsModal;
