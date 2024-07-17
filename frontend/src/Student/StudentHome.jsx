import "./Student.css";
import React from "react";
import profile from "../components/assets/profile.png";
import scribble from "../components/assets/scribble.png";
import { Link } from "react-router-dom";

const StudentHome = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  if (!storedUserInfo) {
    return <div>Error: User information not found.</div>;
  }

  return (
    <div className="student_homepage">
      <div className="student_homepage_title">
        <div className="student_homepage_title_contents">
          <div className="profile-icon">
            <img src={profile} alt="profile" />
          </div>
          <h2>Welcome, {storedUserInfo.name}</h2>
          <div className="profile-icon2">
            <img src={scribble} alt="geometry" />
          </div>
        </div>
        <h3>
          Proctor: {storedUserInfo.procName} ({storedUserInfo.procAbbr})
        </h3>
      </div>
      <div className="student_homepage_buttons">
        <Link to="/student/marks">
          <button className="homepage_buttons">Marks</button>
        </Link>
        <Link to={`/student/achievements/${storedUserInfo.rollNumber}`}>
          <button className="homepage_buttons">View Achievement</button>
        </Link>
        <Link to={`/student/internship/${storedUserInfo.rollNumber}`}>
          <button className="homepage_buttons">View Internship</button>
        </Link>
        <Link to="/student/upload/achievement">
          <button className="homepage_buttons">Upload Achievement</button>
        </Link>
        <Link to="/student/upload/internship">
          <button className="homepage_buttons" id="student_btn_5">
            Upload Internship
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StudentHome;
