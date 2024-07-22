import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./Student.css";
import uploadicon from "../components/assets/uploadicon.png";
import DatePicker from "react-datepicker";
import axios from 'axios';;

const UploadInternship = () => {
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [hours, setHours] = useState(0);
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const storedUserInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  const validateForm = () => {
    if (!company) return "Please enter company name.";
    if (!startDate) return "Please select a start date.";
    if (!endDate) return "Please select an end date.";
    if (endDate < startDate) return "End date cannot be before the start date.";
    if (endDate > new Date()) return "End date cannot be in the future.";
    if (!selectedImage) return "Please upload a certificate.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("company_name", company);
    formData.append("start_date", startDate.toISOString().split("T")[0]);
    formData.append("end_date", endDate.toISOString().split("T")[0]);
    formData.append("company_email", companyEmail);
    formData.append("company_phone", companyPhone);
    formData.append("company_website", companyWebsite);
    formData.append("supervisor", supervisor);
    formData.append("hours", hours);
    formData.append("job_role", jobRole);
    formData.append("description", description);
    formData.append("upload_file", selectedImage);
    formData.append("roll_number", storedUserInfo.rollNumber);
    formData.append("approved", 0);
    formData.append("proctor", storedUserInfo.procAbbr);

    try {
      await axios.post("http://localhost:8000/studentinternship/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = `/student/internship/${storedUserInfo.rollNumber}`;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    if (file && !allowedExtensions.exec(file.name)) {
      alert(
        "Please upload a file with one of the following extensions: .jpg, .jpeg, .png, .pdf"
      );
      e.target.value = "";
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);
  };

  return (
    <div className="student_achievement_wrapper">
      <div className="stuachv_container">
        <h2>New Internship</h2>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="form_group">
            <label htmlFor="company">Company Name:</label>
            <input
              className="student_form"
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="date_block">
            <div>
              <label htmlFor="start_date">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={new Date()}
                className="student_form_start_date"
              />
            </div>

            <div className="form_group">
              <label htmlFor="end_date">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                maxDate={new Date()}
                className="student_form_end_date"
              />
            </div>
          </div>

          <div className="form_group">
            <label htmlFor="companyEmail">Company Email:</label>
            <input
              className="student_form"
              type="text"
              id="companyEmail"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="companyPhone">Company Phone:</label>
            <input
              className="student_form"
              type="number"
              id="companyPhone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="companyWebsite">Company Website:</label>
            <input
              className="student_form"
              type="text"
              id="companyWebsite"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="supervisor">Supervisor:</label>
            <input
              className="student_form"
              type="text"
              id="supervisor"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="hours">Hours:</label>
            <input
              className="student_form"
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="jobRole">Job Role:</label>
            <input
              className="student_form"
              type="text"
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="form_group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="student_form"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="stu_uploads">
            <div className="stuimg-container">
              <h2>Upload Certificate</h2>
              <div className="upload-btn-wrapper">
                <input
                  className="student_up"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="upload-image-input"
                />
              </div>
              <label htmlFor="upload-image-input" className="stu_btn">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    width="400"
                    height="350"
                  />
                ) : (
                  <img
                    src={uploadicon}
                    alt="Upload Icon"
                    width="400"
                    height="350"
                  />
                )}
              </label>
            </div>
            <div className="form_group_btn">
              <button type="submit" disabled={isLoading}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadInternship;
