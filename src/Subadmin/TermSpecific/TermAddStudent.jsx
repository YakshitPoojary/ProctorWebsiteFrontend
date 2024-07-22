import Button from '../../components/Button/Button.jsx'
import '../SubAdmin.css'
import {useState} from 'react';
import ViewStudents from "../../Admin/ViewStudents/ViewStudents.jsx";
import { useParams } from 'react-router';
import axios from 'axios';;


const TermAddStudent = () =>{

    const [selectedFile, setSelectedFile] = useState(null);
    const {year, session} = useParams();
    const [uploading, setUploading] = useState(false);
    const [selectedYear, setSelectedYear] = useState("All");

    const handleDownloadTemplate = () =>{
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}download-csv/Student/`, {
            responseType: 'blob', 
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Students.csv');

            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error downloading template:', error);
        });
    };

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
            setUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('year', year);
            formData.append('session', session);
        
            axios.post(`${process.env.REACT_APP_BACKEND_API_URL}student/`, formData, {
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
            })
            .finally(() => {
                setUploading(false);
            });;
        }
    };

    return (
        <div className="wrapper">
            <div className="subadmin_container">
                <div className='subadmin_inner'>
                    <div className="subadmin_header">Add Students</div>
                    <div className='sub_download'><button onClick={handleDownloadTemplate} style={{gridColumn:'2', color: "blue", background: 'none', border: 'none', fontSize: '25px'}}>Download Template</button></div>
                </div>
                <form encType='multipart/form-data' className="subadminform_container">
                    <div className="subadmin_name">
                        <label>Upload .csv file</label>
                        <input
                            type="file"
                            placeholder="course.csv"
                            onChange={handleFileChange}
                            required />
                    </div>
                </form>
                <select
                    name="current_year"
                    id="current_year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="All" default>View Students</option>
                    <option value="FY">FY</option>
                    <option value="SY">SY</option>
                    <option value="TY">TY</option>
                    <option value="LY">LY</option>
                </select>
                <div className="subadmin_button">
                    <Button onClick={handleFileUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</Button>
                </div>
            </div>
            <ViewStudents current_year={selectedYear}/>
        </div>
    )
}

export default TermAddStudent
