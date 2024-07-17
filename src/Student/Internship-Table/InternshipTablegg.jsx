import "./Internshiptable/InternshipTable.css";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import { useState, useEffect } from 'react';
// const axios = require('axios');

function createData(sr_no, title, description, certificate, hours) {
    return {
        sr_no,
        title,
        description,
        certificate,
        hours,
    };
}

const InternshipTable = () => {
    // const [internships, setInternships] = useState([]);

    // useEffect(() => {
    //     axios.get("http://localhost:8000/studentinternships/")
    //         .then((response) => {
    //             setInternships(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching internships:", error);
    //         });
    // }, []);

    const columns = [
        { id: 'sr_no', label: 'Sr. No.', align: 'center' },
        { id: 'title', label: 'Title', align: 'center' },
        { id: 'description', label: 'Description', align: 'center' },
        { id: 'certificate', label: 'Certificate', align: 'center' },
        { id: 'hours', label: 'Hours', align: 'center' },
    ];

    const rows = [
        createData(1, 'Software Development Internship', 'Worked on full-stack web development', 'https://via.placeholder.com/100', 120),
        createData(2, 'Data Science Internship', 'Analyzed large datasets to derive actionable insights', 'https://via.placeholder.com/100', 100),
    ];

    const [page] = React.useState(0);
    const [rowsPerPage] = React.useState(10);

    return (
        <Paper className="summary_paper">
            <TableContainer className="summary_tableContainer">
                <Table stickyHeader aria-label="sticky table">
                    <TableHead className="sticky-table-head">
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ backgroundColor: '#c2c4c0' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <React.Fragment key={row.sr_no}>
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.id === 'certificate' ? (
                                                <img src={row[column.id]} alt="Certificate" style={{ width: '100px', height: 'auto' }} />
                                            ) : (
                                                row[column.id]
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default InternshipTable;
