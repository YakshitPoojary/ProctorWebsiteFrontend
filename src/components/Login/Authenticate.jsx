import axios from 'axios';


const authApi = {
  async login(username, password) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}api/login/`, { username, password });

      if (response.data.role) {
        const userInfo = {
          role: response.data.role,
          email: response.data.email,
          username: response.data.username,
          accessToken: response.data.access,
          refreshToken: response.data.refresh
        };

        if (response.data.role === 'subadmin') {
          const user = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}subadmincredentials/details/${response.data.email}`);
          userInfo.branch = user.data.branch;
        } else if (response.data.role === 'faculty') {
          const user = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}faculty/details/${response.data.email}`);
          userInfo.branch = user.data.dept;
          userInfo.abbr = user.data.faculty_abbreviation;
          userInfo.name = user.data.faculty_name;
        } else if (response.data.role === 'student') {
          const user = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}student/recent/${response.data.email}`);
          userInfo.branch = user.data.student_branch;
          userInfo.name = user.data.student_name;
          userInfo.procAbbr = user.data.proctor_abbreviation;
          userInfo.procName = user.data.proctor_name;
          userInfo.rollNumber = user.data.roll_number;
        } else if (response.data.role === 'staff') {
          const user = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}staff/details/${response.data.email}`);
          userInfo.branch = user.data.dept;
          userInfo.name = user.data.staff_name;
          userInfo.abbr = user.data.staff_abbreviation;
        }

        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        return sessionStorage.getItem('userInfo');
      }
    } catch (error) {
      console.error('Error during login:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async logout() {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (userInfo && userInfo.refreshToken) {
        await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}api/logout/`, { refresh_token: userInfo.refreshToken });
      }
      sessionStorage.removeItem('userInfo');
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return userInfo ? userInfo : null;
  }
};

export default authApi;
