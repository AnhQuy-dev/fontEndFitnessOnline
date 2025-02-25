import { Drawer, Descriptions, Typography, Tag } from "antd";
const { Title, Text } = Typography;

const DetailPackage = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

  return (
    <Drawer
      title={<Title level={4}>Package Detail</Title>}
      onClose={() => {
        setDataDetail(null);
        setIsDataDetailOpen(false);
      }}
      open={isDataDetailOpen}
      width={600}
      footer={
        <Text type="secondary">
          Thank you for using our service. For more details, please contact support.
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
            <Descriptions.Item label="Package Name">{dataDetail.packageName}</Descriptions.Item>
            <Descriptions.Item label="Description">{dataDetail.description}</Descriptions.Item>
            <Descriptions.Item label="Duration (Months)">{dataDetail.durationMonth}</Descriptions.Item>
            <Descriptions.Item label="Price (VND)">
              {dataDetail.price.toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(...dataDetail.createAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dataDetail.updateAt
                ? new Date(...dataDetail.updateAt).toLocaleString()
                : "Not updated yet"}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>No data available!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default DetailPackage;
