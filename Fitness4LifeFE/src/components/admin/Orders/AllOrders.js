import { useEffect, useState } from 'react';
import { EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu, notification, Popconfirm, Table, Tag } from 'antd';
import '../../../assets/css/club.css';
import DetailOrder from './DetailOrders';
import { getTokenData } from '../../../serviceToken/tokenUtils';

function AllOrders(props) {
    const { loadOrders, dataOrders, filteredData, setFilteredData, setIsModalOpen } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');

    const tokenData = getTokenData(); //tokenData.access_token

    useEffect(() => {
        if (dataOrders && dataOrders.length > 0) {
            // You can add additional data processing here if needed
        }
    }, [dataOrders]);


    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            render: (_, record) => (
                <a
                    href="#"
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.id}
                </a>
            ),
        },
        {
            title: 'Customer Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Package Name',
            dataIndex: 'packageName',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: 'Status',
            dataIndex: 'payStatusType',
            render: (status, record) => {
                let color;
                switch (status) {
                    case 'PENDING':
                        color = 'gold';
                        break;
                    case 'COMPLETED':
                        color = 'green';
                        break;
                    case 'CANCELLED':
                        color = 'red';
                        break;
                    default:
                        color = 'blue';
                }

                return (
                    <Popconfirm
                        title="Change Payment Status"
                        description="Are you sure you want to change the status of this payment?"
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <Tag
                            color={color}
                            style={{ cursor: 'pointer' }}
                        >
                            {status}
                        </Tag>
                    </Popconfirm>
                );
            },
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => {
        //         const menu = (
        //             <Menu>
        //                 <Menu.Item
        //                     key="edit"
        //                     icon={<EditOutlined style={{ color: 'orange' }} />}
        //                     onClick={() => {
        //                         setDataUpdate(record);
        //                         setIsModalUpdateOpen(true);
        //                     }}
        //                 >
        //                     Edit
        //                 </Menu.Item>
        //             </Menu>
        //         );
        //         return (
        //             <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
        //                 <MoreOutlined
        //                     style={{
        //                         fontSize: '18px',
        //                         cursor: 'pointer',
        //                         color: '#1890ff',
        //                     }}
        //                 />
        //             </Dropdown>
        //         );
        //     },
        // },
    ];

    const handleSearch = (value) => {
        const filtered = dataOrders.filter((item) =>
            item.fullName?.toLowerCase().includes(value.toLowerCase()) ||
            item.id?.toString().includes(value) ||
            item.packageName?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <>
            <div>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Orders</h2>
                    </div>
                    <div className="user-form">
                        <PlusOutlined
                            name="plus-circle"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                            style={{ marginRight: 15, color: '#FF6600' }}
                        />
                        <Input
                            placeholder="Search by customer name, order ID, or package name"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            onPressEnter={() => handleSearch(searchText)}
                            style={{ width: 450, marginBottom: 50, marginRight: 100, height: 35 }}
                        />
                    </div>
                </div>

                <Table
                    className="row-highlight-table"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={'id'}
                />
            </div>

            <DetailOrder
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            />
        </>
    );
}

export default AllOrders;