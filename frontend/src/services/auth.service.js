import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const API_URL = 'https://smart-bank-system-2.onrender.com';

const register = (email, password, fullName) => {
  return axios.post(API_URL + '/auth/register', {
    email,
    password,
    full_name: fullName,
  });
};

const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await axios.post(API_URL + '/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.data.access_token) {
    const decodedToken = jwtDecode(response.data.access_token);
    localStorage.setItem('user', JSON.stringify({
      access_token: response.data.access_token,
      email: decodedToken.sub,
      full_name: response.data.full_name,
    }));
  }
  return response;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
