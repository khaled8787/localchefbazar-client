import axios from "axios";
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});
axiosPublic.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token)
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
    
  }
  return config;
});

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(" Unauthorized / Forbidden");
    }
    return Promise.reject(error);
  }
);

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
