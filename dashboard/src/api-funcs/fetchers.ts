import axios from 'axios';
import Cookies from 'js-cookie'

export const dashboard = axios.create({
    baseURL: 'http://localhost:5000/dashboard/',
    withCredentials: true,
})


dashboard.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${Cookies.get('dash-auth-token')}`;
    return config;
});

export const authFetcher = (url: string) => {
    const authToken = Cookies.get('dash-auth-token');
    if(!authToken) {
        return false;
    }
    return dashboard.get(url, { withCredentials: true, headers: { Authorization: `Bearer ${authToken}`, } }).then(res => res.data);
};