import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import Edit from '@mui/icons-material/Edit';
// import Delete from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

let idCounter = 1;
const Termtable = () => {
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
            <Link to={`/subadmin/term/add/student/${params.row.year}/${params.row.session}`}>
              <IconButton>
                <Edit />
              </IconButton>
            </Link>

            {/* <IconButton onClick={() => handleDelete(params.row.year, params.row.session)}>
              <Delete />
            </IconButton> */}
          </div>
        ),
      },
    ],
    []
  );

  const [rows, setRows] = useState([]);

  function createData(year, session) {
    const id = idCounter++;
    return {
      id, year, session,
    };
  }

  const customSort = (a, b) => {
    const yearA = parseInt(a.year.split('-')[0], 10);
    const yearB = parseInt(b.year.split('-')[0], 10);

    if (yearA !== yearB) {
      return yearB - yearA;
    }

    const sessionOrder = { 'Even': 1, 'Odd': 2 };
    return sessionOrder[a.session] - sessionOrder[b.session];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}academicyear`);
        const formattedRows = response.data.map((entry) => {
          const { year, session } = entry;
          return createData(year, session);
        });

        formattedRows.sort(customSort);
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, []);

  // const handleDelete = async (year, session) => {
  //   try {
  //     await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}academicyear/${year}/${session}/delete/`);
  //     setRows((prevRows) => prevRows.filter((row) => !(row.year === year && row.session === session)));
  //     console.log('Term deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting term:', error);
  //   }
  // };

  return (
    <Box sx={{ height: 'auto', margin: '0 4vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

export default Termtable;
