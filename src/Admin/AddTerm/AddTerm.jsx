import "../Admin.css";
import Button from "../../components/Button/Button.jsx";
import { useState } from 'react';
import Termtable from "../../components/TermTable/termtable.jsx";
import axios from 'axios';;

const AddTerm = () => {
    const [termyear, setTermYear] = useState("");
    const [termsem, setTermSem] = useState("");

    const validateYearFormat = (year) => {
        const yearFormat = /^\d{4}-\d{2}$/;
        if (!yearFormat.test(year)) return false;
        
        const [startYear, endYear] = year.split('-').map(Number);
        return endYear - (startYear % 100) === 1;
    };

    const handleButton = () => {
        if (!validateYearFormat(termyear)) {
            alert('Please enter a valid year in the format YYYY-YY and check the year.');
            return;
        }

        if (termyear && termsem) {
            const formData = new FormData();
            formData.append('year', termyear);
            formData.append('session', termsem); 
            axios.post(`${process.env.REACT_APP_BACKEND_API_URL}academicyear/`, formData, {
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
            alert('Please select a year and session.');
        }
    };

    return (
        <div className="wrapper">
            <div className="term_container">
                <div className="term_header">Create New Term</div>
                <div className="termform_container">
                    <div className="term_year">
                        <label>Year</label>
                        <input 
                            type="text" 
                            placeholder="YYYY-YY"
                            value={termyear}
                            onChange={e => setTermYear(e.target.value)}
                            required />
                    </div>

                    <div className="term_sem">
                        <label>Select Session</label>
                        <select 
                            id="term_sem_option" 
                            name="termsem_option"
                            value={termsem}
                            onChange={e => setTermSem(e.target.value)}>
                            <option value="" disabled selected>ODD/EVEN</option>
                            <option value="ODD">Odd</option>
                            <option value="EVEN">Even</option>
                        </select>
                    </div>

                    <div className="term_button">
                        <Button onClick={handleButton}>Create</Button>
                    </div>
                </div>
            </div>
            <Termtable />
        </div>
    )
}

export default AddTerm;
