import { API_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const publicAPI = axios.create({
  baseURL: API_BASE_URL,
});

export const privateAPI = axios.create({
  baseURL: API_BASE_URL,
});

privateAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    // console.log(token);
    // alert( token);
    if (token) {
      config.headers.Authorization = ` ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




privateAPI.interceptors.response.use((res)=>res,async(error)=>{
  if(error.res?.status===401){
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  }
  return Promise.reject(error);
})