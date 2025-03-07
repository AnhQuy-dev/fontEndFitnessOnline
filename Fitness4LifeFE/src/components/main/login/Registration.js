import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/css/Main/login.css';
import { registerUser } from '../../../serviceToken/authService';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema
  const registerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email should be valid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    gender: Yup.string()
      .required("Gender is required"),
    acceptTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
  });

  const { register: registerFormRegister, handleSubmit: handleRegisterSubmit, reset: registerReset, formState: { errors: registerErrors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onRegisterSubmit = async (data) => {
    try {
      setLoading(true);
      const newData = {
        ...data,
        role: "USER"
      };

      const result = await registerUser(newData);

      if (result.status === 201) {
        registerReset();
        toast.success("Registration successful! Redirecting to OTP verification...");
        setTimeout(() => {
          navigate(`/verify-otp/${data.email}`);
        }, 2000);
      } else if (result.status === 400) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>REGISTER FORM</h1>

      <div className="form-container">
        <h2>Register here</h2>

        <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="FULL NAME"
              {...registerFormRegister('fullName')}
              className={`form-control ${registerErrors.fullName ? 'is-invalid' : ''}`}
            />
            {registerErrors.fullName && (
              <div className="invalid-feedback">{registerErrors.fullName.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="EMAIL"
              {...registerFormRegister('email')}
              className={`form-control ${registerErrors.email ? 'is-invalid' : ''}`}
            />
            {registerErrors.email && (
              <div className="invalid-feedback">{registerErrors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="PASSWORD"
              {...registerFormRegister('password')}
              className={`form-control ${registerErrors.password ? 'is-invalid' : ''}`}
            />
            {registerErrors.password && (
              <div className="invalid-feedback">{registerErrors.password.message}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="CONFIRM PASSWORD"
              {...registerFormRegister('confirmPassword')}
              className={`form-control ${registerErrors.confirmPassword ? 'is-invalid' : ''}`}
            />
            {registerErrors.confirmPassword && (
              <div className="invalid-feedback">{registerErrors.confirmPassword.message}</div>
            )}
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="gender-options">
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  {...registerFormRegister('gender')}
                  value="MALE"
                  id="male"
                  defaultChecked
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  {...registerFormRegister('gender')}
                  value="FEMALE"
                  id="female"
                />
                <label htmlFor="female">Female</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  {...registerFormRegister('gender')}
                  value="OTHER"
                  id="other"
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            {registerErrors.gender && (
              <div className="invalid-feedback">{registerErrors.gender.message}</div>
            )}
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              {...registerFormRegister('acceptTerms')}
              id="acceptTerms"
              className={`form-check-input ${registerErrors.acceptTerms ? 'is-invalid' : ''}`}
            />
            <label htmlFor="acceptTerms">I Accept Terms & Conditions</label>
            {registerErrors.acceptTerms && (
              <div className="invalid-feedback">{registerErrors.acceptTerms.message}</div>
            )}
          </div>

          <div className="form-submit">
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "REGISTER"}
            </button>
          </div>
        </form>

        <p className="toggle-form-text">
          Already have an account?
          <span onClick={() => navigate('/login')} className="toggle-form">
            Click Here
          </span>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default Register;