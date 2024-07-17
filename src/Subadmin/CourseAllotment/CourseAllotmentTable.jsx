import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '../../components/Button/Button.jsx';

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
const CourseAllotmentTable = () => {
  const [open, setOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState(null);
  const [password, setPassword] = useState("");
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [rows, setRows] = useState([]);

  const handleOpen = (params) => {
    setDeleteParams(params);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);


  const validatePassword = async (password) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}check/`,{
        params:{
          username: storedUserInfo.username,
          password: password,
        }
      });
      if (response.status === 200) {
        handleDelete(deleteParams.row.course_code,deleteParams.row.faculty_abbreviation);
        handleClose();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Incorrect password');
    }
  };

  function createData(course_code, course_name, course_abbreviation, faculty_abbreviation, staff_abbreviation) {
    const id = idCounter++;
    return {
      id, course_code, course_name, course_abbreviation, faculty_abbreviation, staff_abbreviation,
    };
  }  
  let { year, session } = useParams();
  //! TEMP FIX
  year = year.replace("-", "_");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}courseallotment/${year}/${session}/${storedUserInfo.branch}/`); 

        const formattedRows = response.data.map((entry) => {
          const {course_code, course_name, course_abbreviation, faculty_abbreviation, staff_abbreviation } = entry;
          return createData(course_code, course_name, course_abbreviation, faculty_abbreviation, staff_abbreviation);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [session, storedUserInfo.branch, year]);

  const handleDelete = async (course_code,faculty_abbreviation) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}courseallotment/${faculty_abbreviation}/${course_code}/`);
      
      setRows((prevRows) => prevRows.filter((row) => row.faculty_abbreviation !== faculty_abbreviation && row.course_code !== course_code));
      
      console.log('Staff member deleted successfully.');
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };
  

  const columns = React.useMemo(
    () => [
      { field: 'course_code', headerName: 'Course Code', flex: 1, headerClassName: 'header-cell' },
      { field: 'course_abbreviation', headerName: 'Course Name', flex: 1, headerClassName: 'header-cell' },
      { field: 'faculty_abbreviation', headerName: 'Faculty', flex: 1, headerClassName: 'header-cell' },
      { field: 'staff_abbreviation', headerName: 'Staff', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleOpen(params)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          sx={{ width: '100%', '& .MuiDataGrid-cell': { justifyContent: 'center' }}}
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
            Enter Password to Confirm Deletion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={(e) => { e.preventDefault(); validatePassword(password); }}>
              <div className="assignFields">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="modal_buttons">
                <Button type="submit">Submit</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default CourseAllotmentTable;
