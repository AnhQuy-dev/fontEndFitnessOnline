import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, notification, Popconfirm, Table } from 'antd';
import'../../../assets/css/club.css'; 
import moment from 'moment';
import { deleteBranch } from '../../../services/BrandService';
import UpdateBranch from './UpdateBranch';
import DetailBranch from './DetailBranch';

function AllBranch(props) {
    const { loadBranch, dataBranch,filteredData,setFilteredData,setIsModalOpen} = props;

    console.log(">>>Check DATA",dataBranch);
    
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [brandFillter, setBranchFilters] = useState([]);

    useEffect(() => {
        if (dataBranch && dataBranch.length > 0) {
            const uniqueAddresses = [...new Set(dataBranch.map((branch) => branch.branchName))];
            const filters = uniqueAddresses.map((branchName) => ({
                text: branchName,
                value: branchName,
            }));
            setBranchFilters(filters);
        }
    }, [dataBranch]);

    const columns = [
        {
            title: 'Id',
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
            title: 'Branch Name',
            dataIndex: 'branchName',
            // filters: brandFillter, // Use dynamically generated filters
            // onFilter: (value, record) => record.branchName.startsWith(value),
            // filterSearch: true,
            // width: '25%',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Open Hour',
            dataIndex: 'openHours',
            render: (value) => moment(value, 'HH:mm').format('HH:mm'),
        },
        {
            title: 'Close Hour',
            dataIndex: 'closeHours',
            render: (value) => moment(value, 'HH:mm').format('HH:mm'),
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
                            key="delete"
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                        >
                            <Popconfirm
                                title="Delete Branch"
                                description="Are you sure delete it?"
                                onConfirm={() => handleDeleteBranch(record.id)}
                                okText="Yes"
                                cancelText="No"
                                placement="left"
                            >
                                Delete
                            </Popconfirm>
                        </Menu.Item>
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
        const filtered = dataBranch.filter((item) =>
            item.branchName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        console.log(">>>>CHeck", filtered);
        
    };

    const handleDeleteBranch = async (id) => {
        const res = await deleteBranch(id);
        if (res.data) {
            notification.success({
                message: 'Delete Branch',
                description: 'Delete Branch successfully....!',
            });
            await loadBranch();
        } else {
            notification.error({
                message: 'Error deleting branch',
                description: JSON.stringify(res.message),
            });
        }
    };

    return (
        <>
            <div>
                <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Branches</h2>
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
                            placeholder="Search by name"
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

            <UpdateBranch
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadBranch={loadBranch}
            />

            <DetailBranch
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            />
        </>
    );
}

export default AllBranch;
