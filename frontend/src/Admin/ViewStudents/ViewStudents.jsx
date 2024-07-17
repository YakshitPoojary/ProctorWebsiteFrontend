import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

let idCounter = 1;

const ViewStudents = ({ current_year }) => {
  const [rows, setRows] = useState([]);
  const { year, session } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  console.log('current year: ', current_year);

  const handleOpen = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  function createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, current_year) {
    const id = idCounter++;
    return {
      id, student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, current_year
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}students/${year}/${session}/${storedUserInfo.branch}`, {
          params: {
            current_year: current_year || undefined,
          }
        });

        const formattedRows = response.data.map((entry) => {
          const { student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, current_year } = entry;
          return createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, current_year);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [year, session, current_year]);

  const handleEdit = (id) => {
    const row = rows.find((row) => row.id === id);
    setEditRowData({ ...row });
    setEditRowId(id);
  };

  const handleSave = async (id) => {
    try {
      const formData = {
        student_name: editRowData.student_name,
        roll_number: editRowData.roll_number,
        student_contact_no: editRowData.student_contact_no,
        student_branch: editRowData.student_branch,
        email: editRowData.email,
        proctor_abbreviation: editRowData.proctor_abbreviation,
        year: year,
        session: session,
        current_year: editRowData.current_year,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}subadmin/student/edit`, formData)
        .then(response => {
          console.log(response.data);
          // window.location.reload();
        })
        .catch(error => {
          alert(error.response.data.error);
          window.location.reload();
        });

      setRows((prevRows) => prevRows.map((row) => (row.id === id ? editRowData : row)));
      setEditRowId(null);
      setEditRowData(null);
      console.log('Student updated successfully.');
    } catch (error) {
      console.error('Error updating student:', error);
      setEditRowId(null);
      setEditRowData(null);
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditRowData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRowData((prevData) => ({ ...prevData, [name]: value }));
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Roll Number", "Name", "Year", "Branch", "Email", "Mobile", "Proctor", "Parent Email", "Parent Contact"];
    const tableRows = [];
  
    rows.forEach(row => {
      const rowData = [
        row.roll_number,
        row.student_name,
        row.current_year,
        row.student_branch,
        row.email,
        row.student_contact_no,
        row.proctor_abbreviation,
        row.parent_email_id,
        row.parents_contact_no,
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },   
        1: { cellWidth: 40 },  
        2: { cellWidth: 10 },  
        3: { cellWidth: 15 },  
        4: { cellWidth: 25 },  
        5: { cellWidth: 20 },  
        6: { cellWidth: 10 },  
        7: { cellWidth: 25 }, 
        8: { cellWidth: 25 }, 
      },
    });
  
    doc.text("Student Details", 14, 15);
    doc.save("student_details.pdf");
  };
  

  const columns = React.useMemo(
    () => [
      {
        field: 'roll_number',
        headerName: 'Roll Number',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => params.value
      },
      {
        field: 'student_name',
        headerName: 'Name',
        flex: 3,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="student_name"
              value={editRowData.student_name}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'current_year',
        headerName: 'Year',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="current_year"
              value={editRowData.current_year}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'student_branch',
        headerName: 'Branch',
        flex: 0.6,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="student_branch"
              value={editRowData.student_branch}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 2,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="email"
              value={editRowData.email}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'student_contact_no',
        headerName: 'Mobile',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="student_contact_no"
              value={editRowData.student_contact_no}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'proctor_abbreviation',
        headerName: 'Proctor',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="proctor_abbreviation"
              value={editRowData.proctor_abbreviation}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            params.value
          ),
      },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {editRowId === params.row.id ? (
              <>
                <IconButton onClick={() => handleSave(params.row.id)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <ClearIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={() => handleOpen(params.row)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleEdit(params.row.id)}>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </div>
        ),
      },
    ],
    [editRowId, editRowData]
  );

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Student Information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Proctor:</strong> {selectedStudent.proctor_abbreviation}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Roll Number:</strong> {selectedStudent.roll_number}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Name:</strong> {selectedStudent.student_name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Branch:</strong> {selectedStudent.student_branch}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Email:</strong> {selectedStudent.email}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Mobile:</strong> {selectedStudent.student_contact_no}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Parent Contact Number:</strong> {selectedStudent.parents_contact_no}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Parent Email ID:</strong> {selectedStudent.parent_email_id}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewStudents;
