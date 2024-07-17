import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import CustomHeader from './CustomHeader';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const axios = require('axios');

const AttendanceTable = ({ tutorial }) => {
  const { year, session, code } = useParams();
  const [rows, setRows] = useState([]);

  const monthShortForms = useMemo(() => ({
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
  }), []);

  const formatAttendanceData = useCallback((data) => {
    const mergedData = {};

    data.forEach((entry, index) => {
      const { student_name, roll_number, attendance } = entry;
      if (!mergedData[roll_number]) {
        mergedData[roll_number] = {
          id: index,
          student_name,
          roll_number,
          attendance: {}
        };
      }
      mergedData[roll_number].attendance = {
        ...mergedData[roll_number].attendance,
        ...attendance
      };
    });

    return Object.values(mergedData).map(({ id, student_name, roll_number, attendance }) =>
      createData(id, student_name, roll_number, attendance)
    );
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}attendance/${code}/${year}/${session}/list/`);
        const formattedRows = formatAttendanceData(response.data);
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching attendance data: ', error);
      }
    };

    fetchAttendanceData();
  }, [code, year, session, formatAttendanceData]);

  const createData = (id, student_name, roll_number, attendance) => {
    return {
      id,
      student_name,
      roll_number,
      ...attendance,
    };
  };

  const generateColumns = useCallback((months) => {
    const columns = months.flatMap((month) => {
      let baseColumns = [
        {
          field: month,
          headerName: `${monthShortForms[month]} TH/PR`,
          flex: 1,
          headerClassName: 'header-cell',
          renderHeader: () => <CustomHeader title={`${monthShortForms[month]}_TH/PR`} />,
          valueGetter: (params) => {
            if (params.row[month] !== undefined) {
              return params.row[month];
            } else {
              return '-';
            }
          },
        }
      ];

      if (tutorial === 'YES') {
        baseColumns.push({
          field: month + "_TUT",
          headerName: `${monthShortForms[month]} TUT`,
          flex: 1,
          headerClassName: 'header-cell',
          hide: true,
          renderHeader: () => <CustomHeader title={`${monthShortForms[month]}_TUT`} />,
          valueGetter: (params) => {
            if (params.row[month + "_TUT"] !== undefined) {
              return params.row[month + "_TUT"];
            } else {
              return '-';
            }
          },
        });
      }

      return baseColumns;
    });

    const commonColumns = [
      { field: 'student_name', headerName: 'Name', flex: 5, headerClassName: 'header-cell' },
      { field: 'roll_number', headerName: 'Roll No.', flex: 2, headerClassName: 'header-cell' },
    ];

    return commonColumns.concat(columns);
  }, [monthShortForms, tutorial]);

  const columns = useMemo(() => {
    const oddMonths = ['july', 'august', 'september', 'october', 'november', 'december'];
    const evenMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'];
    const months = session === 'ODD' ? oddMonths : evenMonths;
    return generateColumns(months);
  }, [generateColumns, session]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = columns.map(col => col.headerName);
    const tableRows = [];

    rows.forEach(row => {
      const rowData = columns.map(col => row[col.field] || '-');
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: columns.reduce((acc, col, index) => {
        acc[index] = { cellWidth: 'wrap' };
        return acc;
      }, {})
    });

    doc.save("attendance.pdf");
  };

  return (
    <Box sx={{ height: 'auto', maxWidth: 1400, display: 'flex', flexDirection: 'column'}}>
      <Button 
          onClick={exportToPDF}
          style={{marginLeft: '10px'}}
        >
          Export to PDF
        </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter={false}
        disableColumnSelector={false}
        disableDensitySelector
        sx={{ width: '100%', '& .MuiDataGrid-cell': { justifyContent: 'center' } }}
      />
    </Box>
  );
};

export default AttendanceTable;
