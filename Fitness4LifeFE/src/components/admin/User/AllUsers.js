import { EditOutlined, LockOutlined, MoreOutlined, PlusOutlined, FundViewOutlined, MehOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Table, Switch, Avatar, Image, Tooltip, Radio, Modal, Card, Row, Col, Typography, Empty } from "antd";
import { useEffect, useState } from "react";
import ViewUserDetail from './DetailUser';
import UpdateUser from './UpdateUser';
import ResetPassWord from './ResetPassWord';
import FaceDataManagement from './FaceDataManagement';
import FaceRegistration from './FaceRegistration';

const { Title, Text } = Typography;

// FaceData Modal Component

function AllUsers(props) {
    const { dataUsers, loadUsers, setFilteredData, filteredData, setIsModelOpen } = props

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [isChangePassOpen, setChangePassOpen] = useState(false);
    const [emailFilters, setEmailFilters] = useState([]);
    const [emailChangePass, setEmailChangePass] = useState(null);
    const [userRole, setUserRole] = useState("all"); // new state for role filter: "all", "admin", or "user"
    const [isFaceDataModalOpen, setIsFaceDataModalOpen] = useState(false);
    const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);

    // New state for face data modal
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const uniqueEmails = [...new Set(dataUsers.map(user => user.email))];
        const filters = uniqueEmails.map(email => ({
            text: email,
            value: email,
        }));
        setEmailFilters(filters);
    }, [dataUsers]);

    const [searchText, setSearchText] = useState('');

    // Modified handleSearch to include role filtering
    const handleSearch = (value, role = userRole) => {
        let filtered = dataUsers.filter((item) =>
            item.fullName.toLowerCase().includes(value.toLowerCase())
        );

        // Apply role filter if not "all"
        if (role !== "all") {
            filtered = filtered.filter(user =>
                role === "admin" ? user.role === "ADMIN" : user.role === "USER"
            );
        }

        setFilteredData(filtered);
    };

    // Handle role change
    const handleRoleChange = (e) => {
        const role = e.target.value;
        setUserRole(role);
        handleSearch(searchText, role);
    };

    const handleActiveToggle = (checked, record) => {
        // Here you would handle the API call to update the user's active status
        console.log(`Toggling active status for user ${record.fullName} to ${checked}`);
        // Implement actual API call or state update logic
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'profileDTO',
            key: 'avatar',
            width: '10%',
            render: (profileDTO) => {
                const imagePath = profileDTO?.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

                return (
                    <Avatar
                        size={40}
                        src={<Image src={imagePath} preview={{ mask: <span>View</span> }} />}
                    />
                );
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            width: '20%',
            render: (_, record) => {
                return (
                    <a
                        onClick={() => {
                            setDataDetail(record);
                            setIsDataDetailOpen(true);
                        }}
                    >
                        {record.fullName}
                    </a>
                )
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            filters: emailFilters,
            onFilter: (value, record) => record.email.startsWith(value),
            filterSearch: true,
            width: '30%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '10%',
            render: (role) => (
                <span style={{
                    color: role === "ADMIN" ? "#1890ff" : "#52c41a",
                    fontWeight: 500
                }}>
                    {role === "ADMIN" ? "Admin" : "User"}
                </span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (_, record) => {
                const menuItems = [
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined style={{ color: 'orange' }} />,
                        onClick: () => {
                            setDataUpdate(record);
                            setIsModalUpdateOpen(true);
                        }
                    },
                    {
                        key: "ResetPass",
                        label: "Reset Password",
                        icon: <LockOutlined style={{ color: 'blue' }} />,
                        onClick: () => {
                            setEmailChangePass(record.email);
                            setChangePassOpen(true);
                        }
                    }

                ];
                if (!record.faceDataReponseDTO || !record.faceDataReponseDTO.originalImagePath) {
                    menuItems.push({
                        key: "createFaceData",
                        label: "Create FaceId",
                        icon: <CameraOutlined style={{ color: 'green' }} />,
                        onClick: () => {
                            setSelectedUser(record);
                            setRegistrationModalOpen(true);
                        }
                    });
                }

                return (
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft">
                        <Button
                            type="text"
                            icon={<MoreOutlined
                                style={{
                                    fontSize: '18px',
                                    color: '#1890ff',
                                }}
                            />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <div>
                <div className="table-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div>
                        <h2 style={{ fontWeight: 600, fontSize: "24px" }}>Users</h2>
                    </div>
                    <div className="user-form" style={{ display: "flex", alignItems: "center" }}>
                        <Radio.Group
                            value={userRole}
                            onChange={handleRoleChange}
                            optionType="button"
                            buttonStyle="solid"
                            style={{ marginRight: 16 }}
                        >
                            <Radio.Button value="all">All</Radio.Button>
                            <Radio.Button value="admin">Admin</Radio.Button>
                            <Radio.Button value="user">User</Radio.Button>
                        </Radio.Group>
                        <Input
                            placeholder="Search by name"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            onPressEnter={() => handleSearch(searchText)}
                            style={{ width: 320, marginRight: 16, height: 40 }}
                            prefix={<i className="fas fa-search" style={{ color: '#bfbfbf' }} />}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => { setIsModelOpen(true); }}
                            style={{
                                height: 40,
                                borderRadius: "6px",
                                backgroundColor: "#FF6600",
                                borderColor: "#FF6600"
                            }}
                        >
                            Add User
                        </Button>
                        {/* FaceData Management Button */}
                        <Button
                            type="primary"
                            icon={<FundViewOutlined />}
                            onClick={() => setIsFaceDataModalOpen(true)}
                            style={{
                                height: 40,
                                borderRadius: "6px",
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                marginLeft: 16
                            }}
                        >
                            Manage FaceData
                        </Button>
                    </div>
                </div>

                <Table
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    }}
                    className="user-table"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={"id"}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                />
            </div>

            <UpdateUser
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadUsers={loadUsers}
            />

            <ViewUserDetail
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                isDataDetailOpen={isDataDetailOpen}
                setIsDataDetailOpen={setIsDataDetailOpen}
            />

            <ResetPassWord
                isChangePassOpen={isChangePassOpen}
                setChangePassOpen={setChangePassOpen}
                email={emailChangePass}
            />
            <FaceRegistration
                userId={selectedUser?.id} // Pass the selected user's ID
                isModalOpen={isRegistrationModalOpen}
                setIsModalOpen={setRegistrationModalOpen}
                onSuccess={() => {
                    // Callback function when face registration is successful
                    loadUsers(); // Reload users to get updated face data
                    setSelectedUser(null); // Clear the selected user
                }}
            />

            {/* FaceData Management Modal */}
            <FaceDataManagement
                users={dataUsers}
                isModalOpen={isFaceDataModalOpen}
                setIsModalOpen={setIsFaceDataModalOpen}
            />
        </>
    )
}

export default AllUsers;