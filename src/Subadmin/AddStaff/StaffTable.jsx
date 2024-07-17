import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '../../components/Button/Button.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const axios = require('axios');

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

const StaffTable = () => {
  const [rows, setRows] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState(null);
  const [password, setPassword] = useState("");
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

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
        0: {cellWidth: 250},
        1: {cellWidth: 50}, 
        2: {cellWidth: 200}, 
        3: {cellWidth: 60},
        4: {cellWidth: 100},
        5: {cellWidth: 150}, 
        6: {cellWidth: 100}, 
      },
    });

    doc.save("staff.pdf");
  };

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
        handleDelete(deleteParams.row.staff_abbreviation);
        handleClose();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Incorrect password');
    }
  };

  const createData = (staff_name, staff_abbreviation, staff_email, dept, experience, post, mobile_number) => {
    const id = idCounter++;
    return {
      id,
      staff_name,
      staff_abbreviation,
      staff_email,
      dept,
      experience,
      post,
      mobile_number,
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}staff/list/${storedUserInfo.branch}`);
        console.log("Response: ", response.data);

        const formattedRows = response.data.map((entry) => {
          const { staff_name, staff_abbreviation, staff_email, dept, experience, post, mobile_number } = entry;
          return createData(staff_name, staff_abbreviation, staff_email, dept, experience, post, mobile_number);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [storedUserInfo.branch]);

  const handleDelete = async (abbreviation) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}staff/${abbreviation}/`);
      setRows((prevRows) => prevRows.filter((row) => row.staff_abbreviation !== abbreviation));
      console.log('Staff member deleted successfully.');
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };

  const handleEdit = useCallback((id) => {
    const row = rows.find((row) => row.id === id);
    setEditRowData({ ...row });
    setEditRowId(id);
  }, [rows]);

  const handleSave = useCallback(async (id) => {
    try {
      const formData = new FormData();
      formData.append('staff_name', editRowData.staff_name);
      formData.append('staff_abbreviation', editRowData.staff_abbreviation);
      formData.append('staff_email', editRowData.staff_email);
      formData.append('dept', editRowData.dept);
      formData.append('experience', editRowData.experience);
      formData.append('post', editRowData.post);
      formData.append('mobile_number', editRowData.mobile_number);

      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}subadmin/staff/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRows((prevRows) => prevRows.map((row) => (row.id === id ? editRowData : row)));
      setEditRowId(null);
      setEditRowData(null);
      console.log('Staff updated successfully.');
    } catch (error) {
      console.error('Error updating staff:', error);
      setEditRowId(null);
      setEditRowData(null);
    }
  }, [editRowData]);

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
        field: 'staff_name',
        headerName: 'Name',
        flex: 3,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="staff_name"
              value={editRowData.staff_name}
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
        field: 'staff_abbreviation',
        headerName: 'Initials',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="staff_abbreviation"
              value={editRowData.staff_abbreviation}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
              disabled
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'staff_email',
        headerName: 'E-Mail',
        flex: 2,
        headerClassName: 'header-cell',
        renderCell: (params) =>
          editRowId === params.row.id && editRowData ? (
            <TextField
              name="staff_email"
              value={editRowData.staff_email}
              onChange={handleInputChange}
              onKeyDown={stopPropagation}
              variant="outlined"
              size="small"
              disabled
            />
          ) : (
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'dept',
        headerName: 'Branch',
        flex: 1,
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
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
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
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
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
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'mobile_number',
        headerName: 'Mobile No.',
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
            <div style={{ textAlign: 'center', width: '100%' }}>{params.value}</div>
          ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => {
          const isInEditMode = editRowId === params.row.id;
          return isInEditMode ? (
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
          );
        },
      },
    ],
    [editRowId, editRowData, handleSave, handleEdit]
  );

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

export default StaffTable;
