import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import soms from '../../components/assets/soms_logo.jpeg';
import { useParams } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
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

const InternshipTable = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState({});
  const [studentName, setStudentName] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const BASE_URL = "http://127.0.0.1:8000";
  const { rollNumber } = useParams(); // Use useParams to get the roll number from the URL

  useEffect(() => {
    const fetchUserInternships = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/studentinternship/list/${rollNumber}/`);
        console.log(response.data);

        const { student_name, internship } = response.data;
        setStudentName(student_name);

        const formattedRows = internship.map((entry) => {
          const { id, company_name, start_date, end_date, job_role, hours } = entry;
          return createData(id, company_name, start_date, end_date, job_role, hours);
        });

        setRows(formattedRows);

        const hours = internship.reduce((sum, entry) => sum + parseInt(entry.hours), 0);
        setTotalHours(hours);

      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserInternships();
  }, [rollNumber]);

  function createData(id, company_name, start_date, end_date, job_role, hours) {
    return {
      id, company_name, start_date, end_date, job_role, hours
    };
  }

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `${BASE_URL}${filePath}`;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (internship) => {
    setSelectedInternship(internship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Load the image and add it to the PDF
    const img = new Image();
    img.src = soms;
    img.onload = () => {
      const imgWidth = 50;
      const imgHeight = imgWidth * (img.height / img.width);
      const pageWidth = doc.internal.pageSize.getWidth();
      const x = (pageWidth - imgWidth) / 2;
      doc.addImage(img, 'JPEG', x, 10, imgWidth, imgHeight);

      // Add the student name below the image
      doc.setFontSize(12);
      doc.text(`Student Name: ${studentName}`, pageWidth / 2, imgHeight + 20, { align: 'center' });

      // Add credits and total hours above the table
      const credits = totalHours / 40;
      doc.text(`Total Hours: ${totalHours}`, 15, imgHeight + 30);
      doc.text(`Credits: ${credits.toFixed(2)}`, pageWidth - 50, imgHeight + 30);

      const tableColumns = ["Company Name", "Start Date", "End Date", "Job Role", "Hours"];

      const tableRows = rows.map(row => [
        row.company_name,
        row.start_date,
        row.end_date,
        row.job_role,
        row.hours
      ]);

      // Add the table to the PDF
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: imgHeight + 40,
        styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: { 4: { cellWidth: 'wrap' } }
      });

      doc.save("internships.pdf");
    };
  };

  const columns = React.useMemo(
    () => [
      { field: 'company_name', headerName: 'Company Name', flex: 1, headerClassName: 'header-cell' },
      { field: 'job_role', headerName: 'Job Role', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'upload_file',
        headerName: 'File',
        flex: 0.5,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <button onClick={() => handleDownload(params.value)}>Download</button>
        )
      },
      { field: 'start_date', headerName: 'Start', flex: 0.5, headerClassName: 'header-cell' },
      { field: 'end_date', headerName: 'End', flex: 0.5, headerClassName: 'header-cell' },
      {
        field: 'actions',
        headerName: '',
        flex: 0.5,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleView(params.row)}>
              <Visibility />
            </IconButton>
          </div>
        ),
      },
    ], []
  );

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={exportToPDF}>Export to PDF</button>
        <Typography>
          Total Hours Required: {Math.max(0, 560 - totalHours)}
        </Typography>
        <Typography>
          Current Hours: {totalHours}
        </Typography>
        <Typography>
          Credits: {(totalHours / 40).toFixed(2)}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter={false}
          disableColumnSelector
          disableDensitySelector
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
            Internship Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Company:</strong> {selectedInternship.company_name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Start Date:</strong> {selectedInternship.start_date}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>End Date:</strong> {selectedInternship.end_date}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Job Role:</strong> {selectedInternship.job_role}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Hours:</strong> {selectedInternship.hours}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default InternshipTable;
