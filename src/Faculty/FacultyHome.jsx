import './Faculty.css'
import React from 'react'
import profile from '../components/assets/profile.png'
import scribble from '../components/assets/scribble.png'
import { Link } from 'react-router-dom'

const FacultyHome = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if(!storedUserInfo){
    window.location.href = '/login'
  }
  return (
    <div className='faculty_homepage'>
      <div className='faculty_homepage_title'>
        <div className='faculty_homepage_title_contents'>
            <div className='profile-icon'><img src={profile} alt='profile'></img></div>
            <h2>Welcome {storedUserInfo.name}</h2>
            <div className='profile-icon2'><img src={scribble} alt='geometry'></img></div>
        </div>
      </div>
      <div>
        <div className='faculty_homepage_buttons'>
          <Link to="/faculty/term"><button className='homepage_buttons'>Upload marks</button></Link>
          <Link to="/faculty/view/proctee"><button className='homepage_buttons'>View Proctee</button></Link>
          <Link to="/faculty/view/achievement"><button className='homepage_buttons'>Approve Achievements</button></Link>
          <Link to="/faculty/view/internship"><button className='homepage_buttons'>Approve Internship</button></Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyHome;

