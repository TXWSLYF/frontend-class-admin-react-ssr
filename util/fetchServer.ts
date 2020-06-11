import axios from 'axios';

const fetchServer = axios.create({
    baseURL: 'http://127.0.0.1:7001',
    withCredentials: true,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

fetchServer.interceptors.request.use(
    (requestConfig) => requestConfig,
    (error) => Promise.reject(error),
);

fetchServer.interceptors.response.use(
    (response) => {
        const { errorCode, msg, data } = response.data;

        if (errorCode !== 0) {
            return Promise.reject(new Error(msg));
        }

        return data;
    },
    (error) => Promise.reject(error),
);

export default fetchServer;
