import { useState, useEffect } from 'react';
import { Modal, Select, Button, notification, Typography } from 'antd';
import { fetchAllRooms } from '../../../serviceToken/RoomSERVICE';
import { packageAddRoom } from '../../../serviceToken/PackageSERVICE';
import { getTokenData } from '../../../serviceToken/tokenUtils';

const { Title } = Typography;
const { Option } = Select;

const AddRoomForPackage = (props) => {
  const { isAddRoomModalOpen, setIsAddRoomModalOpen, packageData, loadPackage } = props;

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const tokenData = getTokenData();

  useEffect(() => {
    if (isAddRoomModalOpen) {
      loadRooms();
    }
  }, [isAddRoomModalOpen]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await fetchAllRooms(tokenData.access_token);
      if (response.data) {
        setRooms(response.data);
      } else {
        notification.error({
          message: 'Error fetching rooms',
          description: 'Failed to load rooms data.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'An error occurred while fetching rooms.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    if (!selectedRoom) {
      notification.warning({
        message: 'Selection Required',
        description: 'Please select a room to add to the package.',
      });
      return;
    }

    setLoading(true);
    try {
      // Pass the roomId to the API
      const response = await packageAddRoom(
        packageData.id,
        selectedRoom,
        tokenData.access_token
      );
      console.log("response", response.status);
      
      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: 'Success',
          description: 'Room added to package successfully!',
        });
        loadPackage();
        setIsAddRoomModalOpen(false);
        setSelectedRoom(null);
      } else if (response.status === 500) {
        notification.error({
          message: 'Error',
          description: 'Room đã được thêm vào trước đó rồi !!!',
        });
      } else {
        notification.error({
          message: 'Error',
          description: response.message || 'Failed to add room to package.',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        notification.error({
          message: 'Error',
          description: 'Room đã được thêm vào trước đó rồi !!!',
        });
      } else {
        notification.error({
          message: 'Error',
          description: error.message || 'An error occurred while adding room to package.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddRoomModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <Modal
      title="Add Room to Package"
      open={isAddRoomModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleAddRoom}
        >
          Add Room
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Package: {packageData?.packageName}</Title>
      </div>

      <div>
        <label>Select Room:</label>
        <Select
          style={{ width: '100%', marginTop: 8 }}
          placeholder="Select a room"
          loading={loading}
          onChange={(value) => setSelectedRoom(value)}
          value={selectedRoom}
          optionFilterProp="children"
          showSearch
        >
          {rooms.map((room) => (
            <Option key={room.id} value={room.id}>
              {room.roomName || `Room ${room.id}`}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default AddRoomForPackage;