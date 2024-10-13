import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userImage from '../assets/image.jpg';
import logoImage from '../assets/loo.png'; 
import '../style/style.css';
import Spinner from 'react-bootstrap/Spinner';
import {
  BiHome, BiEdit, BiSearch, BiNotification, BiBookAlt, BiMessage, BiHelpCircle,
  BiSolidReport, BiStats, BiUserCircle, BiLogoReact
} from 'react-icons/bi';
import { Link, Outlet, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user')
      .then(response => {
        if (response.data.Status) {
          setUser(response.data.user);
        } else {
          navigate('/adminlogin');
        }
      })
      .catch(() => {
        navigate('/adminlogin');
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/adminlogin');
        }
      });
  };

  if (!user) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
        <Spinner animation="border" variant="secondary" />
        <Spinner animation="border" variant="success" />
        <Spinner animation="border" variant="danger" />
        <Spinner animation="border" variant="warning" />
        <Spinner animation="border" variant="info" />
        <Spinner animation="border" variant="light" />
        <Spinner animation="border" variant="dark" />
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="secondary" />
        <Spinner animation="grow" variant="success" />
        <Spinner animation="grow" variant="danger" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="info" />
        <Spinner animation="grow" variant="light" />
        <Spinner animation="grow" variant="dark" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className='menu'>
        <div className="logo">
          <br/> 
          <img src={logoImage} alt="Dashboard Logo" className="logo-img" /> {/* Add the logo image */}
        </div>
        <div className="menu--list">
          <Link to='/dashboard' className="item">
            <span>
              <BiHome className='icon' />
              Home
            </span>
          </Link>
          <Link to="/dashboard/employee" className="item">
            <span>
              <BiUserCircle className='icon' />
              Employee
            </span>
          </Link>
          <Link to='/dashboard/category' className="item">
            <BiSolidReport className='icon' />
            Category
          </Link>
          <Link to='/dashboard/chat' className="item">
            <BiMessage className='icon' />
            Message
          </Link>
          <Link to='/dashboard/timesheet' className="item">
            <BiHelpCircle className='icon' />
            Timesheet
          </Link>
          <Link to='/dashboard/timeline' className="item">
            <BiMessage className='icon' />
            Timeline
          </Link>
          <li className="item" onClick={handleLogout}>
            <BiHelpCircle className='icon' />
            Logout
          </li>
        </div>
      </div>

      <div className="dashboard--content">
        <div className='content'>
          <div className='content--header'>
            <h1 className='header--title'> Dashboard </h1>
            <div className="header--activity">
              <div className="search-box">
                <input type="text" placeholder='Search' />
                <BiSearch className='icon' />
              </div>
              <div className='notify'>
                <BiNotification className='icon' />
              </div>
            </div>
          </div>
          <Outlet />
        </div>

        <div className='profile'>
          <div className='profile--header'>
            <h2 className='header-title'>Profile</h2>
            <div className="edit">
              <BiEdit className='icon' />
            </div>
          </div>

          <div className='user--profile'>
            <div className="user--detail">
              <img src={userImage} alt='' />
              <h3 className="username">{user.username}</h3>
              <span className="profession">{user.profession || 'Admin'}</span>
            </div>
            <div className="user-courses">
              <div className='course'>
                <div className="course--detail">
                  <div className="course--cover">
                    <BiLogoReact />
                  </div>
                  <div className="course--name">
                    <h5 className="title"> React</h5>
                  </div>
                </div>
                <div className="action">:</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
