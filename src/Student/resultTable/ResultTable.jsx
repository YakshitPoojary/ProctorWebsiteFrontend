import "./ResultTable.css";
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
const axios = require('axios');;

let idCounter = 1;
const ResultTable = ({ year, session }) => {
  const [rows, setRows] = useState([]);
  const { roll_number } = useParams();

  function createData(course_code, roll_number, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name, th_pr, tut) {
    const id = idCounter++;
    return {
      id,
      course_code,
      roll_number,
      student_name,
      ise: ise || "-",
      ia1: ia1 || "-",
      ia2: ia2 || "-",
      ia3: ia3 || "-",
      ca: ca || "-",
      tw: tw || "-",
      oral: oral || "-",
      ese: ese || "-",
      th_pr: th_pr || "-",
      tut: tut || "-",
      course_name,
    };
  }

  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const columns = React.useMemo(
    () => [
      { field: 'course_code', headerName: 'Course', align: 'center', flex: 0.6 },
      { field: 'course_name', headerName: 'Course Name', align: 'center', flex: 2 },
      { field: 'ise', headerName: 'ISE', align: 'center', flex: 0.5 },
      { field: 'ia1', headerName: 'IA-1', align: 'center', flex: 0.5 },
      { field: 'ia2', headerName: 'IA-2', align: 'center', flex: 0.5 },
      { field: 'ia3', headerName: 'IA-3', align: 'center', flex: 0.5 },
      { field: 'ca', headerName: 'CA', align: 'center', flex: 0.5 },
      { field: 'tw', headerName: 'Lab TW', align: 'center', flex: 0.5 },
      { field: 'ese', headerName: 'ESE', align: 'center', flex: 0.5 },
      { field: 'th_pr', headerName: 'TH/PR', align: 'center', flex: 0.5 },
      { field: 'tut', headerName: 'TUT', align: 'center', flex: 0.5 },
    ],
    []
  );

  const fetchAttendanceData = async (courseCode, roll_number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}attendance/student/${courseCode}/${roll_number}?format=json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data: ', error);
      return { th_pr: "-", tut: "-" };
    }
  };

  useEffect(() => {
    if (year && session) {
      console.log(year, session);
      const fetchUserData = async () => {
        try {
          let response;
          if (roll_number) {
            response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${year}/${session}/${roll_number}/`);
          } else {
            response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${year}/${session}/${storedUserInfo.rollNumber}/`);
          }

          const formattedRows = await Promise.all(response.data.map(async (entry) => {
            const { course_code, roll_number, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name } = entry;
            const attendance = await fetchAttendanceData(course_code, roll_number || storedUserInfo.rollNumber);
            return createData(course_code, roll_number, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name, attendance.th_pr, attendance.tut);
          }));

          setRows(formattedRows);
          console.log(formattedRows);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
      fetchUserData();
    }
  }, [year, session, roll_number, storedUserInfo.rollNumber]);

  return (
    <Box sx={{ height: 'auto', display: 'flex',maxWidth:'1400px',flexDirection: 'column'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        sx={{ width: '100%', '& .MuiDataGrid-cell': { justifyContent: 'center' } }}
      />
    </Box>
  );
}

export default ResultTable;
