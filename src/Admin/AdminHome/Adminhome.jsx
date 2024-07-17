import '../Admin.css'
import React from 'react'
import profile from '../../components/assets/profile.png'
import scribble from '../../components/assets/scribble.png'
import { Link } from 'react-router-dom'

const Adminhome = () => {
  return (
    <div className='admin_homepage'>
      <div className='admin_homepage_title'>
          <div className='admin_homepage_title_contents'>
            <div className='profile-icon'><img src={profile} alt='profile'></img></div>
            <h2>Welcome, Admin</h2>
            <div className='profile-icon2'><img src={scribble} alt='geometry'></img></div>
          </div>
      </div>
      <div className='admin_homepage_buttons'>
        <Link to="/create/term"><button className='homepage_buttons'>Create Term</button></Link>
        <Link to="/create/branch"><button className='homepage_buttons'>Create Branch</button></Link>
        <Link to="/admin/search"><button className='homepage_buttons'>Search</button></Link>
      </div>
    </div>
  )
}

export default Adminhome

