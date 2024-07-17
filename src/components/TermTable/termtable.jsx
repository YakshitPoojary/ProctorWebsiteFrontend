import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Delete from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
const Termtable = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteParams, setDeleteParams] = useState(null);

  const handleOpen = (params) => {
    setDeleteParams(params);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const validatePassword = async (password) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}check/`,{
        params:{
          username: 'admin',
          password: password,
        }
      });
      if (response.status === 200) {
        handleDelete(deleteParams.row.year, deleteParams.row.session);
        handleClose();
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      alert('Incorrect password');
    }
  };
  

  const columns = React.useMemo(
    () => [
      { field: 'year', headerName: 'Year', flex: 1, headerClassName: 'header-cell' },
      { field: 'session', headerName: 'Session', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleOpen(params)}>
              <Delete />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const handleDelete = async (year, session) => {
    const lowercaseSession = session.toUpperCase();
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}academicyear/${year}/${lowercaseSession}/delete/`);
      setRows((prevRows) => prevRows.filter((row) => !(row.year === year && row.session === session)));
      console.log('Data deleted successfully.');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  function createData(year, session) {
    const id = idCounter++;
    return {
      id,
      year,
      session,
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}academicyear`);
        const formattedRows = response.data.map((entry) => {
          const { year, session } = entry;
          return createData(year, session);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box sx={{ height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
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
    </Box>
  );
};

export default Termtable;
