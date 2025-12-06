import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_server_url,
});

// 🔥 Token auto attach
axiosPublic.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log('token', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
});

// Optional: token error হলে handle
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("⛔ Unauthorized / Forbidden");
      // চাইলে logout বা redirect করতে পারো
    }
    return Promise.reject(error);
  }
);

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
