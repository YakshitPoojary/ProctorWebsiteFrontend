import React, { useState } from 'react'
import axios from 'axios';
import Button from '../components/Button/Button';
import './Faculty.css'
import FacultyUploadMarksTable from './MarksTable';
import { useParams } from 'react-router';


const UploadMarks = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [marks, setMarks] = useState(null);
    const {year,session,courseCode} = useParams()
    

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.type === 'text/csv' ||  file.name.endsWith('.csv')) {
            setSelectedFile(file);
        } else {
            alert('Please select a valid CSV file.');
            event.target.value = null;
        }
      }
    };

    const handleFileUpload = () => {
      if (selectedFile && marks) { 
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('exam', marks); 
    
        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}marks/`, formData, {
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
      } else {
        alert('Please select a file and exam.');
      }
    };
    

    const handleDownloadTemplate = () =>{
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${courseCode}/${year}/${session}/download-csv/`, {
          responseType: 'blob', 
      })
      .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
  
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Marks.csv');
  
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
        <div className="faculty_container">
            <div className='faculty_inner'>
                <div className="faculty_header">Upload Marks</div>
                <div className='sub_download'><button onClick={handleDownloadTemplate}  style={{gridColumn:'2', color: "blue", background: 'none', border: 'none', fontSize: '25px'}}>Download Template</button></div>
            </div>
            <form encType='multipart/form-data' className="facultyform_container">
                <div className="faculty_name">
                  <label>Upload .csv file</label>
                  <input
                  id='faculty_up_btn'
                  type="file"
                  placeholder="marks.csv"
                  onChange={handleFileChange} 
                  required />
                </div>
                <div className="faculty_sem">
                  <label>Select Marks</label>
                  <select 
                  id="faculty_sem_option" 
                  name="termsem_option"
                  value ={marks}
                  onChange={e=>setMarks(e.target.value)}>
                    <option value="" disabled selected>Select Marks</option>
                    <option value="ise">ISE</option>
                    <option value="ese">ESE</option>
                    <option value="ia1">IA-1</option>
                    <option value="ia2">IA-2</option>
                    <option value="tw">TW</option>
                    <option value="oral">Oral</option>
                  </select>
                </div>
            </form>
            <div className="faculty_button">
              <Button onClick={handleFileUpload}>Upload</Button>
            </div>
        </div>
      <FacultyUploadMarksTable />
    </div>
  )
}

export default UploadMarks;