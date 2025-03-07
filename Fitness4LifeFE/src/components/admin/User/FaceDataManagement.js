import { Avatar, Image, Modal, Typography, Empty, message, Button, Spin, Alert, Pagination } from "antd";
import { useEffect, useState, useRef } from "react";
import { fetchFaceAuthData, updateFace, updateFaceById } from "../../../serviceToken/authService";
import { getTokenData } from "../../../serviceToken/tokenUtils";
import "../../../assets/css/Admin/FaceDataManagement.css";
import { CameraOutlined, WarningOutlined } from '@ant-design/icons';

// Add face-api.js import if needed
// You'll need to install this library: npm install face-api.js
import * as faceapi from 'face-api.js';

const { Title, Text } = Typography;

function FaceDataManagement({ isModalOpen, setIsModalOpen }) {
  const [faceData, setFaceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [facePosition, setFacePosition] = useState({ centered: false });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectingFace, setDetectingFace] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionRef = useRef(null);
  const tokenData = getTokenData();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // 6 items per page

  // Fetch face data from API when modal opens
  useEffect(() => {
    if (isModalOpen) {
      handleFetchFaceData();
    }
  }, [isModalOpen]);

  // Load face detection models
  useEffect(() => {
    if (isCameraOpen && !modelsLoaded) {
      const loadModels = async () => {
        try {
          // Use CDN for face-api models instead of local path
          const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

          // Show loading message
          message.loading('Loading face detection models...', 0);

          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          ]);

          // Hide loading message and show success
          message.destroy();
          setModelsLoaded(true);
          message.success('Face detection models loaded successfully');
        } catch (error) {
          console.error('Error loading face detection models:', error);
          message.destroy();
          message.error('Failed to load face detection models: ' + error.message);
        }
      };

      loadModels();
    }
  }, [isCameraOpen, modelsLoaded]);

  // Start face detection when camera is on and models are loaded
  useEffect(() => {
    let detectInterval;

    if (isOn && modelsLoaded && videoRef.current) {
      // Start detecting faces
      detectInterval = setInterval(detectFaces, 200);
    }

    return () => {
      if (detectInterval) clearInterval(detectInterval);
    };
  }, [isOn, modelsLoaded]);

  // Function to detect faces and validate position
  const detectFaces = async () => {
    if (!videoRef.current || !modelsLoaded || detectingFace) return;

    try {
      setDetectingFace(true);

      const videoEl = videoRef.current;
      if (videoEl.paused || videoEl.ended || !videoEl.readyState) {
        setDetectingFace(false);
        return;
      }

      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });
      const detections = await faceapi.detectAllFaces(videoEl, options);

      // Check number of faces
      const faceCount = detections.length;
      setFaceDetected(faceCount > 0);
      setMultipleFaces(faceCount > 1);

      // Check face position if exactly one face is detected
      if (faceCount === 1) {
        const face = detections[0];
        const videoWidth = videoEl.videoWidth;
        const videoHeight = videoEl.videoHeight;

        // Calculate face center
        const faceX = face.box.x + (face.box.width / 2);
        const faceY = face.box.y + (face.box.height / 2);

        // Calculate video center
        const centerX = videoWidth / 2;
        const centerY = videoHeight / 2;

        // Check if face is centered (within 20% of center)
        const thresholdX = videoWidth * 0.2;
        const thresholdY = videoHeight * 0.2;

        const isCentered =
          Math.abs(faceX - centerX) < thresholdX &&
          Math.abs(faceY - centerY) < thresholdY;

        setFacePosition({
          centered: isCentered,
          xOffset: faceX - centerX,
          yOffset: faceY - centerY
        });
      } else {
        setFacePosition({ centered: false });
      }

      // Store detection results for reference
      detectionRef.current = {
        faceCount,
        validPosition: faceCount === 1 && facePosition.centered
      };
    } catch (err) {
      console.error("Face detection error:", err);
    } finally {
      setDetectingFace(false);
    }
  };

  // Fetch face data from API using service
  const handleFetchFaceData = async () => {
    setLoading(true);
    try {
      const response = await fetchFaceAuthData(tokenData.access_token);
      console.log('Face data retrieved successfully:', response.data);
      setFaceData(response.data);
    } catch (error) {
      message.error('Failed to retrieve face data');
      console.error('Error fetching face data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    setIsCameraOpen(false);
    setIsModalOpen(false);
  };

  const handleUpdateFace = (user) => {
    setSelectedUser(user);
    setIsCameraOpen(true);
    setFaceDetected(false);
    setMultipleFaces(false);
    setFacePosition({ centered: false });
    // Start camera will be triggered by a button click
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsOn(true);
    } catch (err) {
      console.error("Cannot open camera:", err);
      message.error("Cannot access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsOn(false);
      setFaceDetected(false);
      setMultipleFaces(false);
      setFacePosition({ centered: false });
    }
  };

  // Close camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const closeCamera = () => {
    stopCamera();
    setIsCameraOpen(false);
    setSelectedUser(null);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !selectedUser || !isOn) return;

    // Check if face is valid for capture
    if (!faceDetected) {
      message.error('No face detected. Please position your face in the frame.');
      return;
    }

    if (multipleFaces) {
      message.error('Multiple faces detected. Please ensure only one face is in the frame.');
      return;
    }

    if (!facePosition.centered) {
      message.error('Face not centered. Please position your face in the center of the frame.');
      return;
    }

    setCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      try {
        // Create a File object from the blob
        const file = new File([blob], `face_update_${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        console.log(`Calling API to update face ID: ${selectedUser.userId}`);

        // Call update face API by faceId instead of userId
        const response = await updateFaceById(selectedUser.userId, formData, tokenData.access_token);

        message.success('Face updated successfully');
        closeCamera();
        handleFetchFaceData(); // Refresh the face data
      } catch (error) {
        message.error('Failed to update face: ' + (error.response?.data?.message || error.message));
        console.error('Error updating face:', error);
      } finally {
        setCapturing(false);
      }
    }, 'image/jpeg', 0.9);
  };
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return faceData.slice(startIndex, endIndex);
  };


  // Format registration date
  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 6) return 'Unknown date';

    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);

    return date.toLocaleString();
  };

  // Function to render face detection guidance
  const renderFaceGuidance = () => {
    if (!isOn) return null;

    if (!faceDetected) {
      return (
        <Alert
          message="No face detected"
          description="Please position your face in the frame"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
        />
      );
    }

    if (multipleFaces) {
      return (
        <Alert
          message="Multiple faces detected"
          description="Please ensure only one face is in the frame"
          type="error"
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
        />
      );
    }

    if (!facePosition.centered) {
      return (
        <Alert
          message="Face not centered"
          description="Please position your face in the center of the frame"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
        />
      );
    }

    return (
      <Alert
        message="Face detected correctly"
        description="Your face is properly positioned. You can capture now."
        type="success"
        showIcon
        className="mb-4"
      />
    );
  };
  return (
    <Modal
      title={<Title level={4}>Face Data Management</Title>}
      open={isModalOpen}
      onCancel={handleCancel}
      width={1142}
      footer={null}
      className="face-data-modal"
    >
      {/* Camera Modal */}
      <Modal
        title={<Title level={5}>Update Face for {selectedUser?.username?.split('@')[0]}</Title>}
        open={isCameraOpen}
        onCancel={closeCamera}
        width={700}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              key="onOFF"
              type={isOn ? "default" : "primary"}
              onClick={isOn ? stopCamera : startCamera}
              style={{ marginRight: 'auto' }}
            >
              {isOn ? "Turn Off Camera" : "Turn On Camera"}
            </Button>
            <Button key="cancel" onClick={closeCamera}>
              Cancel
            </Button>
            <Button
              key="capture"
              type="primary"
              onClick={captureImage}
              loading={capturing}
              disabled={!isOn || !faceDetected || multipleFaces || !facePosition.centered}
            >
              Capture and Update
            </Button>
          </div>
        }
        className="camera-modal"
      >
        <div className="camera-container">
          <div className="w-full rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
            {/* Face overlay guide */}
            {isOn && (
              <div
                className="w-full rounded-lg overflow-hidden bg-gray-100 mb-4 relative"
              >
                <div
                  className={`w-64 h-64 border-2 rounded-full ${faceDetected && !multipleFaces && facePosition.centered
                    ? 'border-green-500'
                    : 'border-yellow-500'
                    }`}
                  style={{ opacity: 0.7 }}
                />
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full h-auto object-cover"
              autoPlay
              playsInline
              muted
              style={{ background: '#000', minHeight: '300px' }}
            />
            {!isOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <p className="text-white text-lg">Camera is off</p>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Face detection status */}
          {renderFaceGuidance()}

          {/* Remove this div as we've moved the camera button to the footer */}
        </div>
      </Modal>

      <div className="ag-format-container">
        <div className="ag-courses_box">
          {loading ? (
            <div className="loading-container">
              <div>Loading face data...</div>
            </div>
          ) : faceData && faceData.length > 0 ? (
            getCurrentPageData().map((user) => (
              <div className="ag-courses_item" key={user.faceId}>
                <div className="ag-courses-item_link">
                  <div className="ag-courses-item_bg"></div>

                  {/* Overlay for Update Face button */}
                  <div className="update-face-overlay">
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      onClick={() => handleUpdateFace(user)}
                      className="update-face-btn"
                    >
                      Update Face
                    </Button>
                  </div>

                  {/* User Profile Section */}
                  <div className="user-profile">
                    {user.imageUrl ? (
                      <Avatar
                        size={64}
                        src={user.imageUrl}
                        className="user-avatar"
                      />
                    ) : (
                      <Avatar size={64} className="user-avatar">
                        {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                      </Avatar>
                    )}
                  </div>

                  <div className="ag-courses-item_title">
                    {user.username.split('@')[0]}
                  </div>

                  <div className="ag-courses-item_info">
                    <div className="ag-courses-item_email">
                      {user.email}
                    </div>
                  </div>

                  <div className="ag-courses-item_date-box">
                    Registered:
                    <span className="ag-courses-item_date">
                      {formatDate(user.registeredAt)}
                    </span>
                  </div>

                  <div className="ag-courses-item_user-id">
                    User ID: {user.userId}
                  </div>

                  <div className="ag-courses-item_face-id">
                    Face ID: {user.faceId}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-container">
              <Empty description="No face data found" />
            </div>
          )}
        </div>

        {/* Pagination component */}
        {faceData && faceData.length > 0 && (
          <div className="pagination-container" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={faceData.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FaceDataManagement;