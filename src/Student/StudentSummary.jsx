import "./Student.css";
import { useEffect, useState } from 'react';
import React from "react";
import { useNavigate } from "react-router-dom";
import ResultTable from "./resultTable/ResultTable"; 
import axios from "axios";
import { useParams } from 'react-router-dom';

const StudentSummmary = () => {
    const [year, setYear] = useState(null);
    const [session, setSession] = useState(null);
    const [selectedSem, setSelectedSem] = useState("");
    const [semesters, setSemesters] = useState([]);
    const { roll_number } = useParams();
    const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    const handleSelectSemChange = (event) => {
        setSelectedSem(event.target.value);
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                if(roll_number){
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${roll_number}`);
                    setSemesters(response.data); 
                }
                else{
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${storedUserInfo.rollNumber}`);
                    setSemesters(response.data); 
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchSession();

        const [selectedYear, selectedSession] = selectedSem.split(' ');
        setYear(selectedYear);
        setSession(selectedSession);
        console.log(selectedSem, year, session);
    }, [selectedSem, year, session,roll_number]);

    return (
        <div className="wrapper">
            <div className="student_container">
                <div className="student_header">Student Summary</div>
                <div className="studentform_container">
                    <div className="student_sem">    
                        <label>Select Semester</label>
                        <select id="student_sem_option" value={selectedSem} onChange={handleSelectSemChange}>
                            <option value="" disabled>Select Semester</option>
                            {semesters.map((semester, index) => (
                                <option key={index} value={`${semester.year} ${semester.session}`}>
                                    {`${semester.year} ${semester.session}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <ResultTable year={year} session={session}/>
        </div>
    )
}

export default StudentSummmary;
