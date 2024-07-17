import "../Admin.css";
import Button from "../../components/Button/Button.jsx";
import { useState } from 'react';
import DataGridComponent from "../../components/SubadminInfoDisplayTable/SubadminInfoDisplayTable.jsx";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const axios = require('axios');;

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

const AddBranch = () => {
    const [branchname, setBranchName] = useState("");
    const [branchabbreviation, setBranchAbbreviation] = useState("");
    const [subadminEmail, setSubadminEmail] = useState("");
    const [subadminPassword, setSubadminPassword] = useState("");
    const [subadminUsername, setSubadminUsername] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@somaiya.edu$/;
        return emailPattern.test(email);
    };

    const handleButton = () => {
        if (!validateEmail(subadminEmail)) {
            alert('Please enter a valid subadmin email with @somaiya.edu domain.');
            return;
        }

        if (branchname && branchabbreviation && subadminEmail && subadminPassword && subadminUsername) {
            const formData = new FormData();
            formData.append('branch_name', branchname);
            formData.append('branch_abbreviation', branchabbreviation);
            formData.append('subadmin_email', subadminEmail);
            formData.append('subadmin_password', subadminPassword);
            formData.append('subadmin_username', subadminUsername);

            axios.post(`${process.env.REACT_APP_BACKEND_API_URL}branch/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    alert(error.response.data.error);
                });
        } else {
            alert("Please enter the required data!!");
        }
    };

    return (
        <div className="wrapper">
            <div className="branch_container">
                <div className="branch_header">Create New Branch</div>
                <div className="branchform_container">
                    <div className="branch_name">
                        <label>Name of Branch</label>
                        <input
                            type="text"
                            placeholder="Enter Branch Name"
                            value={branchname}
                            onChange={e => setBranchName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="branch_abbreviation">
                        <label>Abbreviation</label>
                        <input
                            type="text"
                            placeholder="Enter Branch Abbreviation"
                            value={branchabbreviation}
                            onChange={e => setBranchAbbreviation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="branch_abbreviation">
                        <label>Subadmin Email</label>
                        <input
                            type="email"
                            placeholder="Enter Subadmin Email"
                            value={subadminEmail}
                            onChange={e => setSubadminEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="branch_button">
                        <Button onClick={handleOpen}>Create</Button>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Assign Subadmin Username and Password
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <form onSubmit={(e) => { e.preventDefault(); handleButton(); }} className="branchForm">
                                    <div className="assignFields">
                                        <input
                                            type="test"
                                            placeholder="Username"
                                            value={subadminUsername}
                                            onChange={e => setSubadminUsername(e.target.value)}
                                            required
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={subadminPassword}
                                            onChange={e => setSubadminPassword(e.target.value)}
                                            required
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
            </div>
            <DataGridComponent />
        </div>
    );
};

export default AddBranch;
