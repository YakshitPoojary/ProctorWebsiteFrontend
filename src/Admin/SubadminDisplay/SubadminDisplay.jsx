import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const axios = require('axios');

let idCounter = 1
const SubadminDisplay = () => {
  const {branch} = useParams();
  const columns = React.useMemo(
    () => [
      { field: 'sub_admin_email', headerName: 'Email', flex: 1, headerClassName: 'header-cell' },
      { field: 'sub_admin_password', headerName: 'Password', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleEdit(params?.row?.sub_admin_username)}>
              <Link to='/view/subadmins'><EditIcon /></Link>
            </IconButton>
            <IconButton onClick={() => handleDelete(params?.row?.sub_admin_username)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const [rows, setRows] = useState([]);
  function createData(sub_admin_email, sub_admin_password) {
    const id = idCounter++;
    return {
      id, 
      sub_admin_email, sub_admin_password
    };
  }  

  const handleDelete = async (sub_admin_email) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}subadmincredentials/${sub_admin_email}/delete/`);
      
      setRows((prevRows) => prevRows.filter((row) => row.sub_admin_email !== sub_admin_email));
      
      alert('Subadmin deleted successfully.');
    } catch (error) {
      console.error('Error deleting Faculty:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}subadmincredentials/list/${branch}/`);        
        const formattedRows = response.data.map((entry) => {
          const { sub_admin_email, sub_admin_password } = entry;
          return createData(sub_admin_email, sub_admin_password);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [branch]);

  const handleEdit = (id) => {
    console.log('Edit clicked for ID:', id);
  };

  return (
    <Box sx={{ height: 'auto', maxWidth: 1400, margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
    </Box>
  );
};

export default SubadminDisplay;
