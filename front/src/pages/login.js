import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticate } from '../utils/helpers'; // Import authenticate function

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8005/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      // Check if login was successful based on the response from the backend
      if (data.success) {
        // Call authenticate function to store token and user data in sessionStorage
        authenticate(data, () => {
          // Redirect to admin page if user role is admin
          if (data.user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        });
      } else {
        setError(data.message); // Display error message from backend
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <div className='container'>
        <div className="main_div">
          <div className="title">Login Form</div>
          <form onSubmit={handleLogin}>
            <div className="input_box">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input_box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input_box button">
              <input type="submit" value="Login" />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="sign_up">
              Not a member? <Link to="/register">Signup now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
