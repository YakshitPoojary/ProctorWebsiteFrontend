import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Visibility from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [achievementIdToReject, setAchievementIdToReject] = useState(null);
  const [reasonError, setReasonError] = useState('');
  const BASE_URL = "http://127.0.0.1:8000";
  const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchUserAchievement = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/studentinternship/unapproved/${storedUserInfo.abbr}/`);

        const formattedRows = response.data.map((entry) => {
          const { id, roll_number, company_name, company_email, company_phone, company_website, supervisor, job_role, start_date, end_date, description, upload_file } = entry;
          return createData(id, roll_number, company_name, company_email, company_phone, company_website, supervisor, job_role, start_date, end_date, description, upload_file);
        });

        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    fetchUserAchievement();
  }, []);

  function createData(id, roll_number, company_name, company_email, company_phone, company_website, supervisor, job_role, start_date, end_date, description, upload_file) {
    return {
      id, roll_number, company_name, company_email, company_phone, company_website, supervisor, job_role, start_date, end_date, description, upload_file
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

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
    setRejectionReason('');
    setReasonError('');
    setAchievementIdToReject(null);
  };

  const columns = React.useMemo(
    () => [
      { field: 'roll_number', headerName: 'Roll Number', flex: 0.5, headerClassName: 'header-cell' },
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
        flex: 1,
        headerClassName: 'header-cell',
        renderCell: (params) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => handleApproval(params.row.id)}>
              <CheckBoxIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenRejectModal(params.row.id)}>
              <DisabledByDefaultIcon />
            </IconButton>
            <IconButton onClick={() => handleView(params.row)}>
              <Visibility />
            </IconButton>
          </div>
        ),
      },
    ], []
  );

  const handleApproval = async (achievementId) => {
    try {
      await axios.post(`${BASE_URL}/studentinternship/approve/${achievementId}/`);

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== achievementId)
      );
      console.log('Achievement approved successfully.');
    } catch (error) {
      console.error('Error approving achievement:', error);
    }
  };

  const handleOpenRejectModal = (achievementId) => {
    setAchievementIdToReject(achievementId);
    setOpenRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setReasonError('Rejection reason is required.');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/studentinternship/reject/${achievementIdToReject}/`, {
        reason: rejectionReason,
        sender: storedUserInfo.email,
      });

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== achievementIdToReject)
      );
      console.log('Achievement rejected successfully.');
      handleCloseRejectModal();
    } catch (error) {
      console.error('Error rejecting achievement:', error);
    }
  };

  return (
    <div>
      <Box sx={{ height: 'auto', margin: 'auto', maxWidth:'1400px',display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <strong>Company:</strong> {selectedAchievement.company_name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Company Mail:</strong> {selectedAchievement.company_email}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Company Contact:</strong> {selectedAchievement.company_phone}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Company Website:</strong> {selectedAchievement.company_website}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Supervisor:</strong> {selectedAchievement.supervisor}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <strong>Description:</strong> {selectedAchievement.description}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openRejectModal}
        onClose={handleCloseRejectModal}
        aria-labelledby="modal-reject-title"
        aria-describedby="modal-reject-description"
      >
        <Box sx={style}>
          <Typography id="modal-reject-title" variant="h6" component="h2">
            Reason for Rejection
          </Typography>
          <TextField
            id="modal-reject-description"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setReasonError('');
            }}
            sx={{ mt: 2 }}
            required
            error={!!reasonError}
            helperText={reasonError}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseRejectModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleReject}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AchievementsList;
