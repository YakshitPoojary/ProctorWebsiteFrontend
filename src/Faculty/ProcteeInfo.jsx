import '../components/ProcteeTable/ProcteeTable.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';


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
const ProcteeInfo = () => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [rows, setRows] = useState([]);
  const { year, session } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});

  const handleOpen = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const navigate = useNavigate();
  const handleOpenSummary = (student) => {
    navigate(`/student/marks/${student.roll_number}`);
  };

  const handleClose = () => setOpen(false);

  function createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no) {
    const id = idCounter++;
    return {
      id, student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no
    };
  }  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}student/proctor/${storedUserInfo.abbr}`); 
        console.log("Response: ", response.data);

        const formattedRows = response.data.map((entry) => {
          const { student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no } = entry;
          return createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [year, session]);

  const handleDelete = async (faculty_abbreviation) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}faculty/${faculty_abbreviation}/`);
      
      setRows((prevRows) => prevRows.filter((row) => row.faculty_abbreviation !== faculty_abbreviation));
      
      console.log('Faculty deleted successfully.');
    } catch (error) {
      console.error('Error deleting Faculty:', error);
    }
  };
  
  const handleEdit = (id) => {
    console.log('Edit clicked for ID:', id);
  };

  const columns = React.useMemo(
    () => [
      { field: 'roll_number', headerName: 'Roll Number', flex: 1, headerClassName: 'header-cell' },
      { field: 'student_name', headerName: 'Name', flex: 3, headerClassName: 'header-cell' },
      { field: 'student_branch', headerName: 'Branch', flex: 0.6, headerClassName: 'header-cell' },
      { field: 'email', headerName: 'Email', flex: 2, headerClassName: 'header-cell' },
      { field: 'student_contact_no', headerName: 'Mobile', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleOpen(params.row)}>
              <Visibility />
            </IconButton>
            <IconButton onClick={() => handleOpenSummary(params.row)}>
              <ArrowDownwardIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', maxWidth:'1400px',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter = {false}
          disableColumnSelector
          disableDensitySelector
          sx={{ width: '100%', '& .MuiDataGrid-cell': { justifyContent: 'center' } }}
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

export default ProcteeInfo;
