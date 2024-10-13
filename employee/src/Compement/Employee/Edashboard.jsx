import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import '../../style/style.css';
import logoImage from '../../assets/loo.png'
import {
  BiHome, BiEdit, BiSearch, BiNotification, BiBookAlt, BiMessage, BiHelpCircle,
  BiSolidReport, BiStats, BiUserCircle, BiLogoReact
} from 'react-icons/bi';
import { Link, Outlet, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState([]);
 
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;

  useEffect(() => {

    axios.get('http://localhost:3000/auth/category')
    .then(result => {
      if (result.data.Status) {
        setCategory(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    }).catch(err => console.log(err));


    axios.get('http://localhost:3000/employee/user')
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
  const getCategoryName = (id) => {
    const categoryItem = category.find(cat => cat.id === id);
    return categoryItem ? categoryItem.name : "Unknown Category";
  };



  if (!user) {
    return <div> <Spinner animation="border" variant="primary" />
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
    <Spinner animation="grow" variant="dark" /></div>;
  }

  return (
    <div className="dashboard">
      <div className='menu'>
      <div className="logo">
          <br/> 
          <img src={logoImage} alt="Dashboard Logo" className="logo-img" /> {/* Add the logo image */}
        </div>
        <div className="menu--list">
          <Link to='/edashboard' className="item">
            <span>
              <BiHome className='icon' />
              Home
            </span>
          </Link>
         
          <Link to='/edashboard/echat' className="item">
            <BiMessage className='icon' />
            Message
          </Link>
          <Link to='/edashboard/etimesheet' className="item">
            <BiHelpCircle className='icon' />
            Timesheet
          </Link>

          <Link to='/edashboard/etimeline' className="item">
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
              <img src={`http://localhost:3000/images/${user.image}`} alt='' />
              <h3 className="username">{user.name}</h3>
              <span className="profession">{user.profession || 'Employee'}</span>
            </div>
            <div className="user-courses">
              <div className='course'>
                <div className="course--detail">
                  <div className="course--cover">
                    <BiLogoReact />
                  </div>
                  <div className="course--name">
                    <h5 className="title"> {getCategoryName(user.category_id)}</h5>
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