import React, { useState, useEffect } from 'react';
import { logout, getUser } from '../utils/helpers';
import axios from 'axios'; // Import Axios for making HTTP requests

const Header = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  }); // State to store user data

  const handleLogout = () => {
    logout(() => {
      window.location.href = '/'; // Redirect to home page after logout
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUserData({
          name: user.name,
          email: user.email
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <a href="/" className="logo">
                <img src="assets/images/logo.png" alt="" />
              </a>
              <ul className="nav">
                <li><a href="/" className="active">Home</a></li>
                <li><a href="/details">MTICS</a></li>
                <li><a href="/about">About Us</a></li>
                {userData.name ? (
                  <>
                    <li className="dropdown">
                      <a href="/dashboard" className="dropbtn">Programs</a>
                      <div className="dropdown-content">
                        <a href="/getPrograms">Get All Programs</a>
                        <a href="/addProgram">Create Program</a>
                      </div>
                    </li>
                    <li>
                      <a href="/" onClick={handleLogout}>
                        {userData.name} <img src="assets/images/profile-header.jpg" alt="" />
                      </a>
                    </li>
                  </>
                ) : (
                    <li>
                      <a href="/login">
                        Login <img src="assets/images/profile-header.jpg" alt="" />
                      </a>
                    </li>
                  )}
              </ul>
              <a className="menu-trigger">
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
