import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
});
// Thêm một bộ đón chặn request
instance.interceptors.request.use(
    function (config) {
        let storageUser = window.localStorage.getItem('user');
        let googleUser = window.localStorage.getItem('gguser');

        if (JSON.parse(storageUser)) {
            const token = JSON.parse(storageUser);
            if (token) config.headers = { Authorization: `Bearer ${token}` };
            return config;
        }

        if (JSON.parse(googleUser)) {
            const token = JSON.parse(googleUser);
            if (token) config.headers = { Authorization: `Bearer ${token}` };
            return config;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return error.response.data;
    },
);

export default instance;
