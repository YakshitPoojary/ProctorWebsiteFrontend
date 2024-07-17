import React, { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./Student.css";
import uploadicon from "../components/assets/uploadicon.png";

const StudentAchievements = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activityType, setActivityType] = useState("");
  const [activityMembers, setActivityMembers] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });

  const storedUserInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const today = new Date();

  const validateForm = () => {
    if (!title) return "Please enter a title.";
    if (!startDate) return "Please select a start date.";
    if (!endDate) return "Please select an end date.";
    if (endDate < startDate) return "End date cannot be before the start date.";
    if (!selectedImage) return "Please upload a certificate.";
    if (!activityType) return "Please select an activity type.";
    if (!activityMembers) return "Please select activity members.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ error: "", success: "" });

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("start_date", startDate.toISOString().split("T")[0]);
    formData.append("end_date", endDate.toISOString().split("T")[0]);
    formData.append("description", description);
    formData.append("upload_file", selectedImage);
    formData.append("roll_number", storedUserInfo.rollNumber);
    formData.append("activity_type", activityType);
    formData.append("activity_members", activityMembers);
    formData.append("group_members", JSON.stringify(groupMembers));
    formData.append("approved", 0);
    formData.append("proctor", storedUserInfo.procAbbr);

    try {
      await axios.post("http://localhost:8000/studentachievement/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ success: "Successfully created new Student Achievement." });
      window.location.href = `/student/achievements/${storedUserInfo.rollNumber}`;
    } catch {
      setMessage({ error: "Error creating new Student Achievement. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    if (file && !allowedExtensions.exec(file.name)) {
      alert("Please upload a file with one of the following extensions: .jpg, .jpeg, .png, .pdf");
      e.target.value = "";
      setSelectedImage(null);
      return;
    }
    setSelectedImage(file);
  };

  const addGroupMember = () => setGroupMembers([...groupMembers, ""]);

  const handleGroupMemberChange = (index, value) => {
    const newGroupMembers = [...groupMembers];
    newGroupMembers[index] = value;
    setGroupMembers(newGroupMembers);
  };

  return (
    <div className="student_achievement_wrapper">
      <div className="stuachv_container">
        <h2>New Achievements</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
          <div className="form_group_inline">
            <div className="form_group">
              <label htmlFor="activityType">Activity Type</label>
              <div className="checkBox">
                <input
                  type="radio"
                  id="coCurricular"
                  name="activityType"
                  value="Co-curricular"
                  checked={activityType === "Co-curricular"}
                  onChange={(e) => setActivityType(e.target.value)}
                />
                <label htmlFor="coCurricular">Co-curricular</label>
              </div>
              <div className="checkBox">
                <input
                  type="radio"
                  id="extraCurricular"
                  name="activityType"
                  value="Extra-curricular"
                  checked={activityType === "Extra-curricular"}
                  onChange={(e) => setActivityType(e.target.value)}
                />
                <label htmlFor="extraCurricular">Extra-curricular</label>
              </div>
            </div>

            <div className="form_group">
              <label htmlFor="activityMembers">Activity Members</label>
              <div className="checkBox">
                <input
                  type="radio"
                  id="individual"
                  name="activityMembers"
                  value="Individual"
                  checked={activityMembers === "Individual"}
                  onChange={(e) => setActivityMembers(e.target.value)}
                />
                <label htmlFor="individual">Individual</label>
              </div>
              <div className="checkBox">
                <input
                  type="radio"
                  id="group"
                  name="activityMembers"
                  value="Group"
                  checked={activityMembers === "Group"}
                  onChange={(e) => setActivityMembers(e.target.value)}
                />
                <label htmlFor="group">Group</label>
              </div>
            </div>
          </div>
          {activityMembers === "Group" && (
            <div className="group_members">
              <label>Group Members:</label>
              {groupMembers.map((member, index) => (
                <div key={index} className="group_member">
                  <input
                    type="text"
                    placeholder={`Member ${index + 1} Name`}
                    value={member}
                    onChange={(e) => handleGroupMemberChange(index, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" className="add-btn" onClick={addGroupMember}>
                Add Member
              </button>
            </div>
          )}

          <div className="form_group">
            <label htmlFor="title">Title:</label>
            <input
              className="student_form"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="date_block">
            <div>
              <label htmlFor="start_date">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={today}
                className="student_form_start_date"
              />
            </div>

            <div className="form_group">
              <label htmlFor="end_date">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                maxDate={today}
                className="student_form_end_date"
              />
            </div>
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

export default StudentAchievements;
