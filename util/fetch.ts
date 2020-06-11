import axios from 'axios';

const fetch = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

fetch.interceptors.request.use(
    (requestConfig) => requestConfig,
    (error) => Promise.reject(error),
);

fetch.interceptors.response.use(
    (response) => {
        const { errorCode, msg, data } = response.data;

        if (errorCode !== 0) {
            // TODO:统一的错误提示
            // Message.error(msg);

            return Promise.reject(new Error(msg));
        }

        return data;
    },
    (error) => Promise.reject(error),
);

export default fetch;
