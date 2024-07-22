import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './SubadminInfoDisplayTable.css';
import { useState } from 'react';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

let idCounter = 1
const DataGridComponent = () => {
  // const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      { field: 'branch_name', headerName: 'Branch Name', flex: 1, headerClassName: 'header-cell' },
      { field: 'branch_abbreviation', headerName: 'Branch Abbreviation', flex: 1, headerClassName: 'header-cell' },
    ],
    []
  );

  const [rows, setRows] = useState([]);
  function createData(branch_name, branch_abbreviation) {
    const id = idCounter++;
    return {
      id, 
      branch_name: branch_name.toUpperCase(), 
      branch_abbreviation,
    };
  }  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}branch`);
        const formattedRows = response.data.map((entry) => {
          const { branch_name, branch_abbreviation } = entry;
          return createData(branch_name, branch_abbreviation);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, []);

  // const handleEdit = (branch_abbreviation) => {
  //   navigate(`/view/subadmins/${branch_abbreviation}`);
  // };

  // const handleDelete = async (branch_abbreviation) => {
  //   try {
  //     await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}branch/${branch_abbreviation}/delete/`);
      
  //     setRows((prevRows) => prevRows.filter((row) => row.branch_abbreviation !== branch_abbreviation));
      
  //     alert('Branch deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting Faculty:', error);
  //   }
  // };

  return (
    <Box sx={{ height: 'auto', maxWidth: '95%' ,display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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

export default DataGridComponent;
