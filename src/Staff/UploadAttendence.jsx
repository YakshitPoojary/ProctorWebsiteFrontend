import React, { useState, useEffect } from 'react';
import Button from '../components/Button/Button';
import './Staff.css';
import AttendanceTable from './AttendanceTable';
import { useParams } from 'react-router';
const axios = require('axios');

const UploadAttendance = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [classType, setClassType] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  const { year, session, code } = useParams();

  useEffect(() => {
    const fetchCourseDetails = async (course_code) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}course/${course_code}/`);
        setTutorial(response.data.tutorial);
      } catch (error) {
        console.error('Error fetching course details: ', error);
      }
    };

    fetchCourseDetails(code);
  }, [code]);

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

  const handleFileUpload = () => {
    if (selectedFile && selectedMonth) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('month', selectedMonth);
      formData.append('class', classType);
      axios.post(`${process.env.REACT_APP_BACKEND_API_URL}attendance/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log('CSV file uploaded successfully', response.data);
        })
        .catch(error => {
          console.error('Error uploading CSV file', error);
        });
    }
  };

  const handleDownloadTemplate = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}attendance/${code}/${year}/${session}/download-csv/`, {
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Attendance.csv');

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error downloading template:', error);
      });
  };

  const renderMonthOptions = () => {
    const oddMonths = ["july", "august", "september", "october", "november", "december"];
    const evenMonths = ["january", "february", "march", "april", "may", "june"];
    const months = session === "ODD" ? oddMonths : evenMonths;
    return months.map(month => <option key={month} value={month}>{month.charAt(0).toUpperCase() + month.slice(1)}</option>);
  };

  return (
    <div className='wrapper'>
      <div className="staff_container">
        <div className='staff_inner'>
          <div className="staff_header">Upload Attendance</div>
          <div className='sub_download'>
            <button onClick={handleDownloadTemplate} style={{gridColumn:'2', color: "blue", background: 'none', border: 'none', fontSize: '25px'}}>Download Template</button>
          </div>
        </div>
        <form encType='multipart/form-data' className="staffform_container">
          <div className="staff_name">
            <label>Upload .csv file</label>
            <input
              type="file"
              placeholder="course.csv"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className='staff_attnd_up'>
            <select id='classType'
              value={classType}
              onChange={e => setClassType(e.target.value)} required>
              <option value="" disabled selected>Class</option>
              <option value="TH/PR">Theory/Practical</option>
              {tutorial === "YES" && <option value="TUT">Tutorial</option>}
            </select>

            <select id='month_selection'
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)} required>
              <option value="" disabled selected>Month</option>
              {renderMonthOptions()}
            </select>
          </div>
        </form>
        <div className="staff_button">
          <Button onClick={handleFileUpload}>Upload</Button>
        </div>
      </div>
      <AttendanceTable tutorial={tutorial}/>
    </div>
  )
}

export default UploadAttendance;

