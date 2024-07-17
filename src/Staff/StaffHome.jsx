import './Staff.css'
import React from 'react'
import profile from '../components/assets/profile.png'
import scribble from '../components/assets/scribble.png'
import { Link } from 'react-router-dom'

const StaffHome = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  return (
    <div className='staff_homepage'>
      <div className='staff_homepage_title'>
        <div className='staff_homepage_title_contents'>
            <div className='profile-icon'><img src={profile} alt='profile'></img></div>
            <h2>Welcome {storedUserInfo.name}</h2>
            <div className='profile-icon2'><img src={scribble} alt='geometry'></img></div>
        </div>
      </div>
      <div className='staff_homepage_buttons'>
        <Link to="/staff/term"><button className='homepage_buttons'>Upload Attendence</button></Link>
      </div>
    </div>
  );
};

export default StaffHome;

