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

  // Format time consistently as HH:MM
  const formatTime = (timeValue) => {
    // Handle array format [hours, minutes]
    if (Array.isArray(timeValue) && timeValue.length >= 2) {
      const hours = timeValue[0].toString().padStart(2, '0');
      const minutes = timeValue[1].toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // Handle string in format "HH,MM"
    if (typeof timeValue === 'string' && timeValue.includes(',')) {
      const [hours, minutes] = timeValue.split(',');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    // Handle Date object
    if (timeValue instanceof Date && !isNaN(timeValue)) {
      return timeValue.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      });
    }

    // Return as is if none of the above
    return timeValue || '';
  };

  // Format room display with properly formatted time
  const formatRoomDisplay = (room) => {
    const roomName = room.roomName || `Room ${room.id}`;
    let timeDisplay = '';

    // Handle different time formats
    if (room.startTime) {
      timeDisplay = formatTime(room.startTime);
    }

    return `${roomName}${timeDisplay ? ' • ' + timeDisplay : ''}`;
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
              {formatRoomDisplay(room)}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default AddRoomForPackage;