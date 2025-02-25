import { Drawer, Descriptions, Typography, Image } from "antd";

const { Title, Text } = Typography;

const DetailTrainer = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;

  return (
    <Drawer
      title={<Title level={4}>Trainer Detail</Title>}
      onClose={() => {
        setDataDetail(null);
        setIsDataDetailOpen(false);
      }}
      open={isDataDetailOpen}
      width={500}
      footer={
        <Text type="secondary">
          Thank you for viewing the trainer details. Contact us for more information.
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
            <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{dataDetail.fullName}</Descriptions.Item>
            <Descriptions.Item label="Specialization">{dataDetail.specialization}</Descriptions.Item>
            <Descriptions.Item label="Experience Year">{dataDetail.experienceYear} years</Descriptions.Item>
            <Descriptions.Item label="Certificate">{dataDetail.certificate}</Descriptions.Item>
            <Descriptions.Item label="Phone">{dataDetail.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Schedule">
              {dataDetail.scheduleTrainers && dataDetail.scheduleTrainers.length > 0 ? (
                dataDetail.scheduleTrainers.join(", ")
              ) : (
                <Text type="secondary">No schedule available</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Rooms">
              {dataDetail.rooms && dataDetail.rooms.length > 0 ? (
                dataDetail.rooms.map((room, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <Text strong>{room.roomName}</Text> - <Text>{room.facilities}</Text>
                  </div>
                ))
              ) : (
                <Text type="secondary">No rooms assigned</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Title level={5}>Trainer Photo</Title>
            {dataDetail.photo ? (
              <Image
                src={dataDetail.photo}
                alt={`Trainer ${dataDetail.fullName}`}
                style={{ maxHeight: "200px", borderRadius: "10px", margin: "10px 0" }}
                placeholder
              />
            ) : (
              <Text type="secondary">No photo available</Text>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", color: "red" }}>
          <h3>Don't have anything here!</h3>
        </div>
      )}
    </Drawer>
  );
};

export default DetailTrainer;
