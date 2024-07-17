import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import soms from '../components/assets/soms_logo.jpeg';
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

const AchievementsList = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState({});
  const [studentName, setStudentName] = useState('');
  const BASE_URL = "http://127.0.0.1:8000";
  const { rollNumber } = useParams(); // Use useParams to get the roll number from the URL

  useEffect(() => {
    const fetchUserAchievement = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/studentachievement/list/${rollNumber}/`);
        console.log(response.data);
        
        // Extract student_name from response data
        const { student_name, achievements } = response.data;

        // Update student name state
        setStudentName(student_name);

        const formattedRows = achievements.map((entry) => {
          const { id, roll_number, activity_type, activity_members, group_members, start_date, end_date, title, description, upload_file } = entry;
          return createData(id, roll_number, activity_type, activity_members, group_members, start_date, end_date, title, description, upload_file);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUserAchievement();
  }, [rollNumber]);

  function createData(id, roll_number, activity_type, activity_members, group_members, start_date, end_date, title, description, upload_file) {
    return {
      id, roll_number, activity_type, activity_members, group_members, start_date, end_date, title, description, upload_file
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

  const handleView = (achievement) => {
    setSelectedAchievement(achievement);
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
      
      // Add the roll number below the image
      doc.setFontSize(12);
      doc.text(`Roll Number: ${rollNumber}`, pageWidth / 2, imgHeight + 20, { align: 'center' });
      
      // Add the student name below the roll number
      doc.text(`Student Name: ${studentName}`, pageWidth / 2, imgHeight + 30, { align: 'center' });
  
      const tableColumn = ["Title", "Start Date", "End Date", "Activity Members"];
      
      // Separate rows into Co Curricular and Extra Curricular
      const coCurricularRows = [];
      const extraCurricularRows = [];
  
      rows.forEach(row => {
        const rowData = [
          row.title,
          row.start_date,
          row.end_date,
          row.activity_members,
        ];
        if (row.activity_type === 'Co-curricular') {
          coCurricularRows.push(rowData);
        } else if (row.activity_type === 'Extra-curricular') {
          extraCurricularRows.push(rowData);
        }
      });
  
      let startY = imgHeight + 40;
  
      // Add Co Curricular section if it has data
      if (coCurricularRows.length > 0) {
        doc.setFontSize(12);
        doc.text("Co-Curricular", pageWidth / 2, startY, { align: 'center' });
        doc.autoTable({
          head: [tableColumn],
          body: coCurricularRows,
          startY: startY + 10,
          styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
          columnStyles: { 3: { cellWidth: 'wrap' } }
        });
        startY = doc.lastAutoTable.finalY + 10;
      }
  
      // Add Extra Curricular section if it has data
      if (extraCurricularRows.length > 0) {
        if (coCurricularRows.length > 0) {
          doc.addPage();
          startY = 20;
        }
        doc.setFontSize(12);
        doc.text("Extra-Curricular", pageWidth / 2, startY, { align: 'center' });
        doc.autoTable({
          head: [tableColumn],
          body: extraCurricularRows,
          startY: startY + 10,
          styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
          columnStyles: { 3: { cellWidth: 'wrap' } }
        });
      }
  
      doc.save("achievements.pdf");
    };
  };
  
  const columns = React.useMemo(
    () => [
      { field: 'title', headerName: 'Title', flex: 1, headerClassName: 'header-cell' },
      {
        field: 'upload_file',
        headerName: 'File',
        flex: 0.6,
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
        flex: 1,
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
      <Box sx={{ height: 'auto', margin: 'auto', maxWidth:'1450px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            Achievement Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Description:</strong> {selectedAchievement.description}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Activity Type:</strong> {selectedAchievement.activity_type}
          </Typography>
          {selectedAchievement.activity_members !== 'Individual' && (
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Activity Members:</strong> {selectedAchievement.activity_members}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Group Members:</strong> {selectedAchievement.group_members ? selectedAchievement.group_members.join(', ') : ''}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AchievementsList;
