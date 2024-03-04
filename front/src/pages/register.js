import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8005/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        toast.success('Registration successful');
        history.push('/'); // Redirect to home page
      } else {
        // Registration failed
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
      toast.error('An error occurred. Please try again later.');
    }
  };


  return (
    <>
      {/* Created By CodingLab - www.codinglabweb.com */}
      <meta charSet="UTF-8" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
      />
      <div className='container'>
        <div className="main_div">
          <div className="title">Signup Form</div>
          <form onSubmit={handleSubmit}>
            <div className="input_box">
              <input type="text" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <div className="icon">
                <i className="fas fa-user" />
              </div>
            </div>
            <div className="input_box">
              <input type="text" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              <div className="icon">
                <i className="fas fa-phone" />
              </div>
            </div>
            <div className="input_box">
              <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} required />
              <div className="icon">
                <i className="fas fa-map" />
              </div>
            </div>
            <div className="input_box">
              <input type="text" placeholder="Email or Phone" name="email" value={formData.email} onChange={handleChange} required />
              <div className="icon">
                <i className="fas fa-envelope" />
              </div>
            </div>
            <div className="input_box">
              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
              <div className="icon">
                <i className="fas fa-unlock" />
              </div>
            </div>
            <div className="input_box button">
              <input type="submit" value="Register" />
            </div>
            <div className="sign_up">
              Already Registered? <a href="/Login">Login Now</a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
