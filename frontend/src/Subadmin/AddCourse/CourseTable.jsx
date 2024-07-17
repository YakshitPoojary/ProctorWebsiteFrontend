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
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '../../components/Button/Button.jsx';
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

const CourseTable = () => {
  const [open, setOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState(null);
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
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
        handleDelete(deleteParams.row.course_code);
        handleClose();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Incorrect password');
    }
  };

  function createData(course_code, branch, course_name, sem, scheme_name, credit, hours, course_abbreviation) {
    const id = idCounter++;
    return {
      id,
      course_code,
      branch,
      course_name,
      sem,
      scheme_name,
      credit,
      hours,
      course_abbreviation,
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}course/list/${storedUserInfo.branch}`);
        console.log("Response: ", response.data);

        const formattedRows = response.data.map((entry) => {
          const { course_code, branch, course_name, sem, scheme_name, credit, hours, course_abbreviation } = entry;
          return createData(course_code, branch, course_name, sem, scheme_name, credit, hours, course_abbreviation);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (course_code) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}course/${course_code}/`);
      setRows((prevRows) => prevRows.filter((row) => row.course_code !== course_code));
      console.log('Course deleted successfully.');
    } catch (error) {
      console.error('Error deleting Course:', error);
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
      formData.append('course_code', editRowData.course_code);
      formData.append('branch', editRowData.branch);
      formData.append('course_name', editRowData.course_name);
      formData.append('sem', editRowData.sem);
      formData.append('scheme_name', editRowData.scheme_name);
      formData.append('credit', editRowData.credit);
      formData.append('hours', editRowData.hours);
      formData.append('course_abbreviation', editRowData.course_abbreviation);

      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}subadmin/course/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRows((prevRows) => prevRows.map((row) => (row.id === id ? editRowData : row)));
      setEditRowId(null);
      setEditRowData(null);
      console.log('Course updated successfully.');
    } catch (error) {
      console.error('Error updating Course:', error);
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

  const columns = React.useMemo(
    () => [
      {
        field: 'course_name',
        headerName: 'Name',
        flex: 5,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="course_name"
              value={editRowData.course_name}
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
        field: 'course_abbreviation',
        headerName: 'Abbreviation',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="course_abbreviation"
              value={editRowData.course_abbreviation}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'course_code',
        headerName: 'Code',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
        ),
      },
      {
        field: 'branch',
        headerName: 'Branch',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
        ),
      },
      {
        field: 'sem',
        headerName: 'Semester',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="sem"
              value={editRowData.sem}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'scheme_name',
        headerName: 'Scheme',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="scheme_name"
              value={editRowData.scheme_name}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'credit',
        headerName: 'Credits',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="credit"
              value={editRowData.credit}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'hours',
        headerName: 'Hours',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="hours"
              value={editRowData.hours}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
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
    [editRowId, editRowData, open, password]
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
        0: {cellWidth: 350}, 
        1: {cellWidth: 60},  
        2: {cellWidth: 60},  
        3: {cellWidth: 50},  
        4: {cellWidth: 50},  
        5: {cellWidth: 50},  
        6: {cellWidth: 40},  
        7: {cellWidth: 40},  
      },
    });

    doc.save("course_table.pdf");
  };

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
            Confirm Deletion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this course?
          </Typography>
          <TextField
            label="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={() => validatePassword(password)}
            buttonName="Delete"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default CourseTable;
