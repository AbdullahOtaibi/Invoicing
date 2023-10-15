import axios from 'axios'
import { getSecured, postSecured, httpPost, httpGet } from './ApiClient'
export const register = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/register", req);
}

export const login = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/login", req);
}


export const getMyProfile = (req) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/auth/user");
}

export const activateAccount = (userId, otp) => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/activate/" + userId + "/" + otp);
}

export const sendActivationEmail = (emailAddress) => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/sendActivationEmail/" + emailAddress);
}

export const sendResetEmail = (emailAddress) => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/forgot-password/" + emailAddress);
}

export const resetPassword = (data) => {
    return httpPost(process.env.REACT_APP_API_BASE_URL + "/v1/users/reset-password", data);
}






export const updatePassword = (req) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/auth/updatePassword", req);
}

export const updateProfile = (req) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/auth/updateProfile", req);
}


