import React, { useState } from 'react';
import AuthService from './Authenticate';
import './Login.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      if (response) {
        const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (storedUserInfo) {
          const redirectUrl = `/${storedUserInfo.role}/home`;
          window.location.href = redirectUrl;
        }
      } else {
        alert('There was some issue with Login. Please try again');
        window.location.reload();
      }
    } catch (error) {
      setMessage('Invalid credentials');
      console.log(error);
    }
  };

  const handleForgotPassword = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Commented out setOpenPasswordModal(false) to keep reset password modal open
    // setOpenPasswordModal(false);
  };

  const handleSubmitEmail = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}change/password/`, { email });
      setOtpSent(true);
      setMessage('OTP sent to your email.');
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('This email doesnt exist');
      setMessage('There was an error submitting your email. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}verify/otp/`, { email, otp });
      setMessage('OTP verified. You can now reset your password.');
      setOtpVerified(true);
      setOpenPasswordModal(true);
      // Commented out setOpen(false) to keep OTP modal open until reset password completes
      // setOpen(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid or expired OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}reset/password/`, { email, newPassword });
      setMessage('Password reset successful. You can now log in with your new password.');
      setOpen(false);
      setOpenPasswordModal(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password. Please try again.');
    }
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className='outerDiv'>
      <div className='loginContainer'>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="forgotPassword">
            <button type="button" className='forgotButton' onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
          <button type="submit" className='button'>Login</button>
          {message && <div>{message}</div>}
        </form>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="forgot-password-modal-title"
        aria-describedby="forgot-password-modal-description"
      >
        <Box sx={style}>
          <Typography id="forgot-password-modal-title" variant="h6" component="h2">
            Forgot Password
          </Typography>
          <Typography id="forgot-password-modal-description" sx={{ mt: 2 }}>
            Please enter your email address to receive an OTP.
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          {otpSent && (
            <>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button onClick={handleVerifyOtp} variant="contained" sx={{ mt: 2 }}>
                Verify OTP
              </Button>
            </>
          )}
          {!otpSent && (
            <Button onClick={handleSubmitEmail} variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          )}
        </Box>
      </Modal>
      <Modal
        open={openPasswordModal}
        onClose={handleClose}
        aria-labelledby="reset-password-modal-title"
        aria-describedby="reset-password-modal-description"
      >
        <Box sx={style}>
          <Typography id="reset-password-modal-title" variant="h6" component="h2">
            Reset Password
          </Typography>
          <TextField
            label="New Password"
            variant="outlined"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowNewPassword}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button onClick={handleResetPassword} variant="contained" sx={{ mt: 2 }}>
            Reset Password
          </Button>
          {message && <div>{message}</div>}
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
