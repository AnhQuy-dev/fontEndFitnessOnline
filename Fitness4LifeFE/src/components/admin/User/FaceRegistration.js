import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Alert, message, Typography } from 'antd';
import { CameraOutlined, WarningOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { getTokenData } from '../../../serviceToken/tokenUtils';
import "../../../assets/css/Admin/FaceDataManagement.css";


const { Link } = Typography;

function FaceRegistration({ userId, isModalOpen, setIsModalOpen, onSuccess }) {
  // States for camera and face detection
  const [isOn, setIsOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [facePosition, setFacePosition] = useState({ centered: false });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectingFace, setDetectingFace] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionRef = useRef(null);

  // Load face detection models when modal opens
  useEffect(() => {
    if (isModalOpen && !modelsLoaded) {
      const loadModels = async () => {
        try {
          // Use CDN for face-api models
          const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

          message.loading('Loading face detection models...', 0);

          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          ]);

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
  }, [isModalOpen, modelsLoaded]);

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

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  // Start camera
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

  // Stop camera
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

  // Close modal and stop camera
  const handleCancel = () => {
    stopCamera();
    setIsModalOpen(false);
  };

  // Register face with API
  const registerFace = () => {
    if (!videoRef.current || !canvasRef.current || !isOn) return;

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
        const file = new File([blob], `face_register_${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Get token data
        const tokenData = getTokenData();

        // Call API to register face
        const response = await axios.post(
          `http://localhost:9001/api/face-auth/register/${userId || '902'}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${tokenData.access_token}`
            }
          }
        );

        message.success('Face registered successfully');
        stopCamera();
        setIsModalOpen(false);

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (error) {
        message.error('Failed to register face: ' + (error.response?.data?.message || error.message));
        console.error('Error registering face:', error);
      } finally {
        setCapturing(false);
      }
    }, 'image/jpeg', 0.9);
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

  // Function to toggle instructions visibility
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <Modal
      title="Register Face"
      open={isModalOpen}
      onCancel={handleCancel}
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
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            key="register"
            type="primary"
            onClick={registerFace}
            loading={capturing}
            disabled={!isOn || !faceDetected || multipleFaces || !facePosition.centered}
          >
            Register Face
          </Button>
        </div>
      }
      className="camera-modal"
    >
      <div className="camera-container">
        <div className="w-full rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
          {/* Face overlay guide */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className={`w-64 h-64 border-2 rounded-full ${faceDetected && !multipleFaces && facePosition.centered
                ? 'border-green-500'
                : 'border-yellow-500'
                }`}
              style={{
                opacity: 0.7,
                borderWidth: '3px'
              }}
            />
          </div>

          <video
            ref={videoRef}
            className="w-full h-auto object-cover"
            autoPlay
            playsInline
            muted
            style={{ background: '#000', minHeight: '320px' }}
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

        {/* Collapsible Instructions Link */}
        <div style={{ marginTop: '16px' }}>
          <Link
            onClick={toggleInstructions}
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {showInstructions ? <DownOutlined style={{ marginRight: 5 }} /> : <RightOutlined style={{ marginRight: 5 }} />}
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Link>

          {showInstructions && (
            <div style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #e8e8e8'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Face Registration Instructions:
              </p>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Make sure you are in a well-lit environment</li>
                <li>Position your face within the circular guide</li>
                <li>Look directly at the camera</li>
                <li>Maintain a neutral expression</li>
                <li>Wait for the green indication that your face is properly positioned</li>
                <li>Click "Register Face" to complete registration</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default FaceRegistration;