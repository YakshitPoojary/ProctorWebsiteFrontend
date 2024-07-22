import React, { useEffect, useState } from 'react';
import soms from '../assets/soms_logo.jpeg';
import './navbar.css';
import Logout from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import AuthService from '../Login/Authenticate';

const Navbar = ({ role }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  
  useEffect(() => {
    if (storedUserInfo) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [storedUserInfo]);

  const handleLogout = () => {
    AuthService.logout();
    sessionStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  let path;

  switch (role) {
    case 'admin':
      path = '/admin/home';
      break;

    case 'subadmin':
      path = '/subadmin/home';
      break;

    case 'student':
      path = '/student/home';
      break;

    case 'faculty':
      path = '/faculty/home';
      break;

    case 'staff':
      path = '/staff/home';
      break;

    case '':
    default:
      path = '/login';
      break;
  }

  return (
    <div className='nav-bar'>
      <ul className='nav-contents'>
        <li><Link to={path}><img src={soms} alt='logo'></img></Link></li>
        <div className='nav-right-contents'>
          {isLoggedIn && (
            <h3>Welcome {storedUserInfo.branch ? storedUserInfo.branch : 'Admin'}</h3>
          )}
          {isLoggedIn ? (
            <button className='nav-btn-login' onClick={handleLogout}><Logout />Logout</button>
          ) : (
            <Link to="/login"><button className='nav-btn-login'>Login</button></Link>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
