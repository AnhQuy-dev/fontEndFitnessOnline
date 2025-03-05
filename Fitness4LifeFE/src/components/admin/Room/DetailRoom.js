import { Drawer, Descriptions, Typography, List, Tag } from "antd";
const { Title, Text } = Typography;

const DetailRoom = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

  return (
    <Drawer
      title={<Title level={4}>Room Detail</Title>}
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
            <Descriptions.Item label="Room Name">{dataDetail.roomName}</Descriptions.Item>
            <Descriptions.Item label="Slug">{dataDetail.slug}</Descriptions.Item>
            <Descriptions.Item label="Capacity">{dataDetail.capacity}</Descriptions.Item>
            <Descriptions.Item label="Available Seats">{dataDetail.availableSeats}</Descriptions.Item>
            <Descriptions.Item label="Facilities">{dataDetail.facilities}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {dataDetail.status ? <Tag color="green">Available</Tag> : <Tag color="red">Unavailable</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">{`${dataDetail.startTime[0]}:${dataDetail.startTime[1]}`}</Descriptions.Item>
            <Descriptions.Item label="End Time">{`${dataDetail.endTime[0]}:${dataDetail.endTime[1]}`}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(...dataDetail.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dataDetail.updatedAt
                ? new Date(...dataDetail.updatedAt).toLocaleString()
                : "Not updated yet"}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>Không có dữ liệu ở đây!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default DetailRoom;
