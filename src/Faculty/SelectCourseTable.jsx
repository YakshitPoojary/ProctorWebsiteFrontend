import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import '../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

let idCounter = 1;
const FacultyCourseSelectTable = ({ branch }) => {
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const {year,session} = useParams();
  const columns = React.useMemo(
    () => [
      { field: 'course_name', headerName: 'Course Name', flex: 5, headerClassName: 'header-cell' },
      { field: 'course_code', headerName: 'Course Code', flex: 1, headerClassName: 'header-cell' },
      { field: 'year', headerName: 'Year', flex: 1, headerClassName: 'header-cell' },
      { field: 'session', headerName: 'Session', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <Link to={`/faculty/upload/marks/${params.row.year}/${params.row.session}/${params.row.course_code}`}><EditIcon/></Link>
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const [rows, setRows] = useState([]);
  function createData(course_code, course_name, year, session, course_abbreviation, faculty_abbreviation, staff_abbreviation) {
    const id = idCounter++;
    return {
      id, 
      course_code, course_name, year, session, course_abbreviation, faculty_abbreviation, staff_abbreviation
    };
  }  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}courseallotment/abbr/${storedUserInfo.abbr}/${year}/${session}`);
        const formattedRows = response.data.map((entry) => {
          const { course_code, course_name, year, session, course_abbreviation, faculty_abbreviation, staff_abbreviation } = entry;
          return createData(course_code, course_name, year, session, course_abbreviation, faculty_abbreviation, staff_abbreviation);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserData();
  }, [branch, session, storedUserInfo.abbr, year]);

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
        sx={{ width: '100%', '& .MuiDataGrid-cell': { justifyContent: 'center' }}}
      />
    </Box>
  );
};

export default FacultyCourseSelectTable;
