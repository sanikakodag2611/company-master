import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'https://your-api-base-url.com/api',
//   timeout: 1000,
//   headers: {'Authorization': 'Bearer your-token'}
// });
axios.defaults.withCredentials=true;
export default axios;
