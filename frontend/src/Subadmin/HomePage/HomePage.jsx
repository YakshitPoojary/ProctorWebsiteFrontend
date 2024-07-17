import '../SubAdmin.css'
import React from 'react'
import profile from '../../components/assets/profile.png'
import scribble from '../../components/assets/scribble.png'
import { Link } from 'react-router-dom'

const SubAdminHomepage = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if(!storedUserInfo){
    window.location.href = '/login'
  }
  return (
    <div className='subadmin_homepage'>
      <div className='subadmin_homepage_title'>
          <div className='subadmin_homepage_title_contents'>
            <div className='profile-icon'><img src={profile} alt='profile'></img></div>
            <h2>Welcome {storedUserInfo.branch}</h2>
            <div className='profile-icon2'><img src={scribble} alt='geometry'></img></div>
          </div>
      </div>
      <div className='subadmin_homepage_buttons'>
        <Link to="/subadmin/add/faculty"><button className='homepage_buttons'>Add Faculty </button></Link>
        <Link to="/subadmin/add/course"><button className='homepage_buttons'>Add Course</button></Link>
        <Link to="/subadmin/add/staff"><button className='homepage_buttons'>Add Staff</button></Link>
        <Link to="/subadmin/term/add"><button className='homepage_buttons'>Add Students</button></Link>
        <Link to="/subadmin/term/allot"><button className='homepage_buttons' id='btn-5'>Allot Course</button></Link>
        <Link to="/subadmin/search"><button className='homepage_buttons'id='btn-6'>Search</button></Link>
      </div>
    </div>
  );
};

export default SubAdminHomepage;

