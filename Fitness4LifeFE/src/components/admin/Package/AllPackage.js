import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, notification, Popconfirm, Table } from 'antd';
import { deletePackage } from '../../../serviceToken/PackageSERVICE';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import UpdatePackage from './UpdatePackage';
import DetailPackage from './DetailPAckage';
import AddRoomForPackage from './AddRoomForPackage';

function AllPackage(props) {
    const { loadPackage, dataPackage, filteredData, setFilteredData, setIsModalOpen } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const [searchText, setSearchText] = useState('');
    const tokenData = getTokenData();//tokenData.access_token

    const columns = [
        {
            title: 'Package Name',
            dataIndex: 'packageName',
            render: (_, record) => (
                <a
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.packageName}
                </a>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (_, record) => (
                <a
                    onClick={() => {
                        setDataDetail(record);
                        setIsDataDetailOpen(true);
                    }}
                >
                    {record.description}
                </a>
            ),
        },
        {
            title: 'Duration (Months)',
            dataIndex: 'durationMonth',
        },
        {
            title: 'Price (VND)',
            dataIndex: 'price',
            render: (value) => value.toLocaleString('vi-VN'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            key="edit"
                            icon={<EditOutlined style={{ color: 'orange' }} />}
                            onClick={() => {
                                setDataUpdate(record);
                                setIsModalUpdateOpen(true);
                            }}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            key="add-room"
                            icon={<AppstoreAddOutlined style={{ color: 'green' }} />}
                            onClick={() => {
                                setSelectedPackage(record);
                                setIsAddRoomModalOpen(true);
                            }}
                        >
                            Add Room
                        </Menu.Item>
                        {/* <Menu.Item
                            key="delete"
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                        >
                            <Popconfirm
                                title="Delete Package"
                                description="Are you sure delete it?"
                                // onConfirm={() => handleDeletePackage(record.id)}
                                okText="Yes"
                                cancelText="No"
                                placement="left"
                            >
                                Delete
                            </Popconfirm>
                        </Menu.Item> */}
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                        <MoreOutlined
                            style={{
                                fontSize: '18px',
                                cursor: 'pointer',
                                color: '#1890ff',
                            }}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const handleSearch = (value) => {
        const filtered = dataPackage.filter((item) =>
            item.packageName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // const handleDeletePackage = async (id) => {
    //     const res = await deletePackage(id, tokenData.access_token);
    //     if (res.data) {
    //         notification.success({
    //             message: 'Delete Package',
    //             description: 'Delete Package successfully....!',
    //         });
    //         await loadPackage();
    //     } else {
    //         notification.error({
    //             message: 'Error deleting package',
    //             description: JSON.stringify(res.message),
    //         });
    //     }
    // };

    return (
        <>
            <div>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Packages</h2>
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
                            placeholder="Search by package name"
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

            <UpdatePackage
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadPackage={loadPackage}
            />

            <AddRoomForPackage
                isAddRoomModalOpen={isAddRoomModalOpen}
                setIsAddRoomModalOpen={setIsAddRoomModalOpen}
                packageData={selectedPackage}
                loadPackage={loadPackage}
            />

            <DetailPackage
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            />
        </>
    );
}

export default AllPackage;