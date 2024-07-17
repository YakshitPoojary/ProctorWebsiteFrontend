import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '../../components/Button/Button.jsx';
import axios from 'axios';
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
const FacultyTable = () => {
  const [rows, setRows] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState(null);
  const [password, setPassword] = useState("");
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const handleOpen = (params) => {
    setDeleteParams(params);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const validatePassword = async (password) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}check/`, {
        params: {
          username: storedUserInfo.username,
          password: password,
        }
      });
      if (response.status === 200) {
        handleDelete(deleteParams.row.faculty_abbreviation);
        handleClose();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Incorrect password');
    }
  };

  function createData(faculty_name, faculty_abbreviation, faculty_email, dept, employee_code, mobile_number, post, experience) {
    const id = idCounter++;
    return {
      id,
      faculty_name,
      faculty_abbreviation,
      faculty_email,
      dept,
      employee_code,
      mobile_number,
      post,
      experience,
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}faculty/branch/${storedUserInfo.branch}/`);
        const formattedRows = response.data.map((entry) => {
          const { faculty_name, faculty_abbreviation, faculty_email, dept, employee_code, mobile_number, post, experience } = entry;
          return createData(faculty_name, faculty_abbreviation, faculty_email, dept, employee_code, mobile_number, post, experience);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, []);

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
    const row = rows.find((row) => row.id === id);
    setEditRowData({ ...row });
    setEditRowId(id);
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append('faculty_abbreviation', editRowData.faculty_abbreviation);
      formData.append('dept', editRowData.dept);
      formData.append('faculty_name', editRowData.faculty_name);
      formData.append('mobile_number', editRowData.mobile_number);
      formData.append('post', editRowData.post);
      formData.append('experience', editRowData.experience);

      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}subadmin/faculty/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRows((prevRows) => prevRows.map((row) => (row.id === id ? editRowData : row)));
      setEditRowId(null);
      setEditRowData(null);
      console.log('Faculty updated successfully.');
    } catch (error) {
      console.error('Error updating Faculty:', error);
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

  useEffect(() => {
    setEditRowId(editRowId);
  }, [editRowData, editRowId]);

  const columns = React.useMemo(
    () => [
      {
        field: 'faculty_abbreviation',
        headerName: 'Initials',
        flex: 0.7,
        headerClassName: 'header-cell',
        renderCell: (params) => params.value,
      },
      {
        field: 'employee_code',
        headerName: 'Code',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => params.value
      },
      {
        field: 'dept',
        headerName: 'Branch',
        flex: 0.7,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="dept"
              value={editRowData.dept}
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
        field: 'faculty_name',
        headerName: 'Name',
        flex: 3,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="faculty_name"
              value={editRowData.faculty_name}
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
        field: 'faculty_email',
        headerName: 'E-Mail',
        flex: 2,
        headerClassName: 'header-cell',
        renderCell: (params) => params.value
      },
      {
        field: 'mobile_number',
        headerName: 'Mobile',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="mobile_number"
              value={editRowData.mobile_number}
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
        field: 'post',
        headerName: 'Post',
        flex: 2,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="post"
              value={editRowData.post}
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
        field: 'experience',
        headerName: 'Experience',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="experience"
              value={editRowData.experience}
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
                <IconButton onClick={() => handleEdit(params.row.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpen(params)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </div>
        ),
      },
    ],
    [editRowId, editRowData]
  );

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'pt');
    
    const tableColumn = columns
      .filter(col => col.field !== 'actions')
      .map(col => col.headerName);
    
    const tableRows = rows.map(row => 
      columns
        .filter(col => col.field !== 'actions')
        .map(col => row[col.field])
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: {cellWidth: 40},
        1: {cellWidth: 50}, 
        2: {cellWidth: 40}, 
        3: {cellWidth: 150},
        4: {cellWidth: 150},
        5: {cellWidth: 60}, 
        6: {cellWidth: 120}, 
        7: {cellWidth: 50}, 
      },
    });

    doc.save("faculty.pdf");
  };

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter={false}
          disableColumnSelector
          disableDensitySelector
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

export default FacultyTable;