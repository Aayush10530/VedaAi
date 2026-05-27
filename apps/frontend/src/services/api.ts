import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
