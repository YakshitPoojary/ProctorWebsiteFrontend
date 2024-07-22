import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../../components/ProcteeTable/ProcteeTable.css'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Admin/Admin.css';
import GradeIcon from '@mui/icons-material/Grade';
import WorkIcon from '@mui/icons-material/Work';
import axios from 'axios';

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
const ViewStudents = () => {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [branchOptions, setBranchOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedYear, setSelectedYear] = useState("All");
  const navigate = useNavigate();

  const handleOpen = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleOpenSummary = React.useCallback((student) => {
    navigate(`/student/marks/${student.roll_number}`);
  }, [navigate]);

  const handleOpenAchievements = React.useCallback((student) => {
    navigate(`/student/achievements/${student.roll_number}`);
  },[navigate]);

  const handleOpenInternship = React.useCallback((student) => {
    navigate(`/student/internship/${student.roll_number}`);
  },[navigate]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}branch`);
        setBranchOptions(response.data);
      } catch (error) {
        console.error('Error fetching branch data: ', error);
      }
    };

    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}academicyear`);
        setYearOptions(response.data);
      } catch (error) {
        console.error('Error fetching year data: ', error);
      }
    };

    fetchBranchData();
    fetchYearData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}search/student/`, {
          params: {
            searchTerm: searchTerm || undefined,
            branch: branch || undefined,
            year: year || undefined,
            current_year: selectedYear !== "All" ? selectedYear : undefined,
          }
        });
        if (response.data.length === 0) {
          setRows([]);
        } else {
          const formattedRows = response.data.map((entry) => {
            const { student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, proctor_email, proctor_mobile_number, proctor_name } = entry;
            return createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, proctor_email, proctor_mobile_number, proctor_name);
          });

          setRows(formattedRows);
        }

      } catch (error) {
        console.error('Error fetching search results: ', error);
        setRows([]);
      }
    };

    fetchData();
  }, [searchTerm, branch, year, selectedYear]);

  function createData(student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, proctor_email, proctor_mobile_number, proctor_name) {
    const id = idCounter++;
    return {
      id, student_name, roll_number, student_contact_no, student_branch, email, parent_email_id, parents_contact_no, proctor_abbreviation, proctor_email, proctor_mobile_number, proctor_name
    };
  }

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
            <IconButton onClick={() => handleOpenAchievements(params.row)}>
              <GradeIcon/>
            </IconButton>
            <IconButton onClick={() => handleOpenInternship(params.row)}>
              <WorkIcon/>
            </IconButton>
          </div>
        ),
      },
    ],[handleOpenAchievements, handleOpenSummary, handleOpenInternship]
  );

  return (
    <div className="wrapper">
      <div className='term_container'>
        <h1 className='term_header'>Student Search</h1>
        <div className='termform_container'>
          <div>
            <label htmlFor="searchTerm">Search Student:</label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Name or Roll Number"
            />
          </div>
          <div>
            <label htmlFor="branch">Branch:</label>
            <select
              id="shared_branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branchOptions.map((option) => (
                <option key={option.branch_abbreviation} value={option.branch_abbreviation}>
                  {option.branch_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {yearOptions.map((option) => (
                <option key={`${option.year}|${option.session}`} value={`${option.year}|${option.session}`}>
                  {option.year} ({option.session})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Current Year:</label>
            <select
              name="current_year"
              id="current_year_shared"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All</option>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="LY">LY</option>
            </select>
          </div>
        </div>
      </div>

      <Box sx={{ height: 'auto', maxWidth:'95%', display: 'flex', flexDirection: 'column'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter={false}
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
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
            <strong>Parent Email:</strong> {selectedStudent.parent_email_id}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Parent Mobile:</strong> {selectedStudent.parents_contact_no}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Proctor Name:</strong> {selectedStudent.proctor_name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Proctor Email:</strong> {selectedStudent.proctor_email}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Proctor Mobile:</strong> {selectedStudent.proctor_mobile_number}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewStudents;
