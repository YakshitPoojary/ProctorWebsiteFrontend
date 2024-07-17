import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

let idCounter = 1;

const MarksTable = () => {
  const { courseCode, year, session } = useParams();

  const columns = React.useMemo(
    () => [
      { field: 'student_name', headerName: 'Student Name', flex: 3, headerClassName: 'header-cell' },
      { field: 'roll_number', headerName: 'Roll No.', flex: 1, headerClassName: 'header-cell' },
      { field: 'division', headerName: 'Division', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ise', headerName: 'ISE', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ia1', headerName: 'IA-1', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ia2', headerName: 'IA-2', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ia3', headerName: 'IA-3', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ca', headerName: 'CA', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'tw', headerName: 'TW', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'oral', headerName: 'OR', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'ese', headerName: 'ESE', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'th_pr', headerName: 'TH/PR', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'tut', headerName: 'TUT', flex: 0.5, headerClassName: 'header-cell' },
    ],
    []
  );

  const [rows, setRows] = useState([]);

  function createData(course_code, roll_number, division, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name, th_pr, tut) {
    const id = idCounter++;
    return {
      id, course_code, roll_number, division, student_name, ise: ise || "-",
      ia1: ia1 || "-", ia2: ia2 || "-", ia3: ia3 || "-", ca: ca || "-",
      tw: tw || "-", oral: oral || "-", ese: ese || "-", course_name, th_pr, tut
    };
  }

  
  useEffect(() => {

    const fetchAttendanceData = async (roll_number) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}attendance/student/${courseCode}/${roll_number}?format=json`);
        return response.data;
      } catch (error) {
        console.error('Error fetching attendance data: ', error);
        return { th_pr: "-", tut: "-" };
      }
    };
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}marks/${year}/${session}/${courseCode}?format=json`);
        const formattedRows = await Promise.all(response.data.map(async (entry) => {
          const { course_code, roll_number, division, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name } = entry;
          const attendance = await fetchAttendanceData(roll_number);
          return createData(course_code, roll_number, division, student_name, ise, ia1, ia2, ia3, ca, tw, oral, ese, course_name, attendance.th_pr, attendance.tut);
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [courseCode, year, session]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Student Name", "Roll No.", "Division", "ISE", "IA-1", "IA-2", "IA-3", "CA", "TW", "OR", "ESE", "TH/PR", "TUT"];
    const tableRows = [];

    rows.forEach(row => {
      const rowData = [
        row.student_name,
        row.roll_number,
        row.division,
        row.ise,
        row.ia1,
        row.ia2,
        row.ia3,
        row.ca,
        row.tw,
        row.oral,
        row.ese,
        row.th_pr,
        row.tut,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 },  // Student Name
        1: { cellWidth: 20 },  // Roll No.
        2: { cellWidth: 15 },  // Division
        3: { cellWidth: 10 },  // ISE
        4: { cellWidth: 10 },  // IA-1
        5: { cellWidth: 10 },  // IA-2
        6: { cellWidth: 10 },  // IA-3
        7: { cellWidth: 10 },  // CA
        8: { cellWidth: 10 },  // TW
        9: { cellWidth: 10 },  // OR
        10: { cellWidth: 15 },  // ESE
        11: { cellWidth: 20 },  // TH/PR
        12: { cellWidth: 20 },  // TUT
      },
    });

    doc.text("Marks Details", 14, 15);
    doc.save("marks_details.pdf");
  };

  return (
    <Box sx={{ height: 'auto', maxWidth: 1500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          components={{
            Toolbar: (props) => (
              <div>
                <Button 
                  onClick={exportToPDF}
                  style={{marginLeft: '10px'}}
                >
                  Export to PDF
                </Button>
              </div>
            ),
          }}
          getRowId={(row) => row.id}
          sx={{ width: '100%'}}
        />
    </Box>
  );
};

export default MarksTable;
