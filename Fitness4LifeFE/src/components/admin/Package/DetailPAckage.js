import { Drawer, Descriptions, Typography, Tag, Table, Spin, Empty, Button, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteRoomFormPackageId, fetchAllRoomByPackageId } from "../../../serviceToken/PackageSERVICE";
const { Title, Text } = Typography;

const DetailPackage = (props) => {
  const { dataDetail, setDataDetail, isDataDetailOpen, setIsDataDetailOpen } = props;
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tokenData = getTokenData();//tokenData.access_token

  useEffect(() => {
    // Gọi API lấy danh sách phòng khi component được mở và có dataDetail
    if (isDataDetailOpen && dataDetail) {
      fetchRooms();
    }
  }, [isDataDetailOpen, dataDetail]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy danh sách phòng theo package ID
      const response = await fetchAllRoomByPackageId(dataDetail.id, tokenData.access_token);
      console.log("response", response);

      setRoomList(response);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRoomList([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa room khỏi package
  const handleDeleteRoom = async (roomId) => {
    try {
      setDeleteLoading(true);
      const packageId = dataDetail.id
      console.log("pakId", packageId)
      console.log("roomID", roomId);

      await deleteRoomFormPackageId(packageId, roomId, tokenData.access_token);
      message.success("Room has been removed from package successfully");
      // Cập nhật lại danh sách room sau khi xóa
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      message.error("Failed to remove room from package");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cấu hình các cột cho bảng phòng
  const roomColumns = [
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Available Seats",
      dataIndex: "availableSeats",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Remove room"
          description="Are you sure you want to remove this room from the package?"
          onConfirm={() => handleDeleteRoom(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true, loading: deleteLoading }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    }
  ];

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

          {/* Phần hiển thị danh sách phòng */}
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Available Rooms</Title>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin />
              </div>
            ) : roomList.length > 0 ? (
              <Table
                dataSource={roomList}
                columns={roomColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
                bordered
              />
            ) : (
              <Empty description="No rooms available for this package" />
            )}
          </div>
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