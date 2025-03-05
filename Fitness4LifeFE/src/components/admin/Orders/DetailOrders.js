import { Drawer, Descriptions, Typography, Tag } from "antd";
const { Title, Text } = Typography;

const DetailOrder = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'gold';
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'blue';
    }
  };

  // Format date array to string
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return 'N/A';
    }
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
  };

  // Format datetime array to string
  const formatDateTime = (dateTimeArray) => {
    if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 7) {
      return 'N/A';
    }
    return `${dateTimeArray[0]}-${String(dateTimeArray[1]).padStart(2, '0')}-${String(dateTimeArray[2]).padStart(2, '0')} ${String(dateTimeArray[3]).padStart(2, '0')}:${String(dateTimeArray[4]).padStart(2, '0')}:${String(dateTimeArray[5]).padStart(2, '0')}`;
  };

  return (
    <Drawer
      title={<Title level={4}>Order Detail</Title>}
      onClose={() => {
        setDataDetail(null);
        setIsDataDetailOpen(false);
      }}
      open={isDataDetailOpen}
      width={600}
      footer={
        <Text type="secondary">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Để biết thêm chi tiết, vui lòng liên hệ với bộ phận hỗ trợ.
        </Text>
      }
    >
      {dataDetail ? (
        <>
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold", width: "30%" }}
            contentStyle={{ background: "#fafafa" }}
          >
            <Descriptions.Item label="Order ID">{dataDetail.id}</Descriptions.Item>
            <Descriptions.Item label="User ID">{dataDetail.userId}</Descriptions.Item>
            <Descriptions.Item label="Customer Name">{dataDetail.fullName}</Descriptions.Item>
            <Descriptions.Item label="Package ID">{dataDetail.packageId}</Descriptions.Item>
            <Descriptions.Item label="Package Name">{dataDetail.packageName}</Descriptions.Item>
            <Descriptions.Item label="Description">{dataDetail.description}</Descriptions.Item>
            <Descriptions.Item label="Buy Date">
              {formatDateTime(dataDetail.buyDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {formatDate(dataDetail.startDate)}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {formatDate(dataDetail.endDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {dataDetail.totalAmount.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">{dataDetail.payMethodType}</Descriptions.Item>
            <Descriptions.Item label="Payment ID">
              {dataDetail.paymentId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Payer ID">
              {dataDetail.payerId || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag color={getStatusColor(dataDetail.payStatusType)}>
                {dataDetail.payStatusType}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Title level={5}>Package Information</Title>
            <Text>
              This membership package ({dataDetail.packageName}) provides access to {dataDetail.description} services.
              The package is valid from {formatDate(dataDetail.startDate)} to {formatDate(dataDetail.endDate)}.
            </Text>
          </div>

          {dataDetail.paymentId && (
            <div style={{ marginTop: "20px" }}>
              <Title level={5}>Payment Information</Title>
              <Descriptions
                bordered
                column={1}
                size="small"
                labelStyle={{ fontWeight: "bold", width: "30%" }}
                contentStyle={{ background: "#fafafa" }}
              >
                <Descriptions.Item label="Payment ID">{dataDetail.paymentId}</Descriptions.Item>
                <Descriptions.Item label="Payer ID">{dataDetail.payerId || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Payment Method">{dataDetail.payMethodType}</Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag color={getStatusColor(dataDetail.payStatusType)}>{dataDetail.payStatusType}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>Không có dữ liệu ở đây!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default DetailOrder;