import axios from 'axios';
import cookies from 'js-cookie';
import { API_URL as DEFAULT_URL } from '../config/env.config';

const API_URL = `${DEFAULT_URL}/api`;

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = cookies.get('jwt-auth', { path: "/" });
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;