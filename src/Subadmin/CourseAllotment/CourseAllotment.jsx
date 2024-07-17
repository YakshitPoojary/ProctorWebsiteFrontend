import React, { useState } from 'react';
import '../SubAdmin.css';
import Button from "../../components/Button/Button.jsx";
import CourseAllotmentTable from './CourseAllotmentTable.jsx';
import axios from 'axios';
import { useParams } from 'react-router';

const CourseAllotment = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const {year, session} = useParams()

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid CSV file.');
        event.target.value = null;
      }
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('year', year);
      formData.append('session', session);
  
      axios.post(`${process.env.REACT_APP_BACKEND_API_URL}courseallotment/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
          console.error('Error uploading Excel data', error);
          if(error.response.data.errors && Array.isArray(error.response.data.errors)){
              error.response.data.errors.forEach(errorMsg => {
                  alert(errorMsg);
              });
          }
          window.location.reload();
      });
    }
  };

  const handleDownloadTemplate = () =>{
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}download-csv/CourseAllotment/`, {
        responseType: 'blob', 
    })
    .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CourseAllotment.csv');

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    })
    .catch(error => {
        console.error('Error downloading template:', error);
    });
  };
  

  return (
    <div className='wrapper'>
      <div className="subadmin_container">
        <div className='subadmin_inner'>
          <div className="subadmin_header">Allot Course</div>
          <div className='sub_download'>
            <button onClick={handleDownloadTemplate} style={{gridColumn:'2', color: "blue", background: 'none', border: 'none', fontSize: '25px'}}>Download Template</button>
          </div>
        </div>
        <form encType='multipart/form-data' className="subadminform_container" style={{gap:'50px'}}>
          <div className="subadmin_name">
            <label>Upload .csv file</label>
            <input
              type="file"
              placeholder="course.csv"
              onChange={handleFileChange} 
              required />
          </div>
        </form>
        <div className="subadmin_button">
          <Button onClick={handleFileUpload}>Upload</Button>
        </div>
      </div>
      <CourseAllotmentTable />
    </div>
  );
}

export default CourseAllotment;
