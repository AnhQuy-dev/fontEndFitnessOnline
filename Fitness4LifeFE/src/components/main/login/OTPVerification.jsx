import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyOTP } from '../../../serviceToken/authService';

const OTPVerification = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);



  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      // Verify OTP
      const response = await verifyOTP(otpCode, email);

      if (response.status === 200) {
        toast.success("Account verified successfully!");
        // Redirect to login page after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.message || "Invalid OTP!");
      }
    } catch (error) {
      toast.error(error.message || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      let newOtp = [...otp];

      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`).focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      setOtp(pastedData.split(''));
    }
  };

  return (
    <div className="otp-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Verify OTP</h2>
      <p>Please enter the 6-digit code sent to <b>{email}</b></p>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            maxLength="1"
            autoComplete="off"
          />
        ))}
      </div>

      <button
        className="btn-verify"
        onClick={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          "Verify OTP"
        )}
      </button>
    </div>
  );
};

export default OTPVerification;