import React from "react";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import Login from "./components/Login/Login";

//Admin
import Adminhome from "./Admin/AdminHome/Adminhome";
import AddTerm from "./Admin/AddTerm/AddTerm";
import AddBranch from "./Admin/AddBranch/AddBranch";
import SearchStudent from "./Shared/SearchStudent/SearchStudent";

//Subadmin
import HomePage from "./Subadmin/HomePage/HomePage";
import AddCourse from "./Subadmin/AddCourse/AddCourse";
import AddFaculty from "./Subadmin/AddFaculty/AddFaculty";
import AddStaff from "./Subadmin/AddStaff/AddStaff";
import TermTable from "./Subadmin/TermSpecific/TermSpecificTable";
import Termtable from "./Subadmin/TermSpecific/TermTable";
import TermAddStudent from "./Subadmin/TermSpecific/TermAddStudent";
import CourseAllotment from "./Subadmin/CourseAllotment/CourseAllotment";

//Student
import StudentHome from "./Student/StudentHome";
import UploadAchievements from "./Student/UploadAchievements";
import UploadInternship from "./Student/UploadInternship";
import Achievements from "./Student/Achievements";
import StudentSummary from "./Student/StudentSummary";
import InternshipTable from "./Student/Internshiptable/InternshipTablegg";

//Faculty
import FacultyHome from "./Faculty/FacultyHome";
import UploadMarks from "./Faculty/UploadMarks";
import SelectCourseTable from "./Faculty/SelectCourseTable";
import Proctorachv from "./Faculty/Proctorachv";
import ProctorIntern from "./Faculty/ProctorIntern";

//Staff
import StaffUploadAttendence from "./Staff/UploadAttendence";
import StaffHome from "./Staff/StaffHome";
import StaffTermTable from "./Staff/StaffTermTable";

//Proctor

import "./App.css";
import { Route, Routes } from "react-router-dom";
import SubadminDisplay from "./Admin/SubadminDisplay/SubadminDisplay";
import ProcteeInfo from "./Faculty/ProcteeInfo";
import StaffCourseSelectTable from "./Staff/StaffCourseTable";
import FacultyTermTable from "./Faculty/FacultyTermTable";

const Layout = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  var navRole = "";
  if (storedUserInfo) {
    navRole = storedUserInfo.role;
  }
  return (
    <div>
      <div className="content-container">
        <Navbar role={navRole} />
        <Routes>
          <Route path="/*" element={<Login />} />

          {/* Renamed all Admin */}
          <Route path="/admin/home" element={<Adminhome />} />
          <Route path="/create/term" element={<AddTerm />} />
          <Route path="/create/branch" element={<AddBranch />} />
          <Route path="/view/subadmins/:branch" element={<SubadminDisplay />} />
          {/* <Route path="/view/students/:year/:session" element={<ViewStudents />} /> */}
          <Route path="/admin/search" element={<SearchStudent />} />
          <Route path="/student/marks/:roll_number" element={<StudentSummary />}/>

          {/* Renamed all Subadmin */}
          <Route path="/subadmin/home" element={<HomePage />} />
          <Route path="/subadmin/add/course" element={<AddCourse />} />
          <Route path="/subadmin/add/staff" element={<AddStaff />} />
          <Route path="/subadmin/add/faculty" element={<AddFaculty />} />
          <Route path="/subadmin/term/add" element={<TermTable />} />
          <Route path="/subadmin/term/add/student/:year/:session" element={<TermAddStudent />}/>
          <Route path="/subadmin/term/allot" element={<Termtable />} />
          <Route path="/subadmin/allot/course/:year/:session" element={<CourseAllotment />}/>
          <Route path="/subadmin/search" element={<SearchStudent />} />
          <Route path="/student/marks/:roll_number" element={<StudentSummary />}/>

          {/* Renamed all faculty */}
          <Route path="/faculty/home" element={<FacultyHome />} />
          <Route path="/faculty/term" element={<FacultyTermTable />} />
          <Route path="/faculty/course/:year/:session" element={<SelectCourseTable />}/>
          <Route path="/faculty/upload/marks/:year/:session/:courseCode" element={<UploadMarks />}/>
          <Route path="/faculty/view/proctee" element={<ProcteeInfo />} />
          <Route path="/faculty/view/achievement" element={<Proctorachv />} />
          <Route path="/faculty/view/internship" element={<ProctorIntern />} />

          {/* Renamed all Student */}
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/student/marks" element={<StudentSummary />} />
          <Route path="/student/achievements/:rollNumber" element={<Achievements />} />
          <Route path="/student/internship/:rollNumber" element={<InternshipTable />} />
          <Route path="/student/upload/achievement" element={<UploadAchievements />}/>
          <Route path="/student/upload/internship" element={<UploadInternship />}/>

          {/* Renamed all Staff */}
          <Route path="/staff/home" element={<StaffHome />} />
          <Route path="/staff/term" element={<StaffTermTable />}/>
          <Route path="/staff/course/:year/:session" element={<StaffCourseSelectTable />}/>
          <Route path="/staff/upload/attendance/:year/:session/:code" element={<StaffUploadAttendence />}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
