import { useEffect, useState } from 'react';
import { EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Input, Menu, notification, Popconfirm, Table, Tag, DatePicker } from 'antd';
import dayjs from 'dayjs';
import '../../../assets/css/club.css';
import DetailOrder from './DetailOrders';
import { getTokenData } from '../../../serviceToken/tokenUtils';

const { RangePicker } = DatePicker;

function AllOrders(props) {
    const { loadOrders, dataOrders, filteredData, setFilteredData, setIsModalOpen } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [isDataDetailOpen, setIsDataDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState(null);

    const tokenData = getTokenData(); //tokenData.access_token

    useEffect(() => {
        if (dataOrders && dataOrders.length > 0) {
            // Initial filter application when data loads
            applyFilters();
        }
    }, [dataOrders]);

    // Function to apply both text search and date range filters
    const applyFilters = () => {
        if (!dataOrders) return;

        let filtered = [...dataOrders];

        // Apply text search filter
        if (searchText) {
            filtered = filtered.filter((item) =>
                item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.id?.toString().includes(searchText) ||
                item.packageName?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Apply date range filter
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].startOf('day');
            const endDate = dateRange[1].endOf('day');

            filtered = filtered.filter((item) => {
                const itemStartDate = dayjs(item.startDate);
                // Sử dụng isSameOrAfter và isSameOrBefore thay vì isAfter và isBefore
                // để bao gồm cả ngày được chọn trong bộ lọc
                return (itemStartDate.isAfter(startDate) || itemStartDate.isSame(startDate, 'day')) &&
                    (itemStartDate.isBefore(endDate) || itemStartDate.isSame(endDate, 'day'));
            });
        }

        setFilteredData(filtered);
    };

    // Handle text search
    const handleSearch = (value) => {
        setSearchText(value);
        applyFilters();
    };

    // Handle date range selection
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        applyFilters();
    };

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
            title: 'Buy Date',
            dataIndex: 'buyDate',
            render: (buyDate) => {
                if (!buyDate) return '';

                // Nếu buyDate là một mảng (như trong ví dụ của bạn)
                if (Array.isArray(buyDate)) {
                    // Lấy các thành phần từ mảng
                    const year = buyDate[0];
                    const month = buyDate[1];
                    const day = buyDate[2];
                    const hour = buyDate[3];
                    const minute = buyDate[4];
                    const second = buyDate[5];

                    // Tạo chuỗi định dạng
                    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
                }

                // Nếu buyDate là kiểu date string thông thường
                return dayjs(buyDate).format('HH:mm:ss DD/MM/YYYY');
            },
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
    ];

    // Effect to reapply filters when search text or date range changes
    useEffect(() => {
        applyFilters();
    }, [searchText, dateRange]);

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
                            }}
                            style={{ width: 450, marginBottom: 10, marginRight: 20, height: 35 }}
                        />
                    </div>
                </div>

                {/* Date Range Filter */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 5 }}>Date Range:</div>
                    <RangePicker
                        onChange={handleDateRangeChange}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder={['Start Date', 'End Date']}
                    />
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