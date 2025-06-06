import axios from 'axios';

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
};

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

agent.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
});

export default agent;