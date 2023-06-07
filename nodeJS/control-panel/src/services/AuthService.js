import axios from 'axios'

export const register = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/register", req);
}

export const login = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/login", req);
}


export const getMyProfile = (req) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/auth/user", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const activateAccount = (userId, otp) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/activate/" + userId + "/" + otp);
}

export const sendActivationEmail = (emailAddress) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/sendActivationEmail/" + emailAddress);
}

export const sendResetEmail = (emailAddress) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/forgot-password/" + emailAddress);
}

export const resetPassword = (data) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/users/reset-password", data);
}






export const updatePassword = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/updatePassword", req, {headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const updateProfile = (req) => {
    return axios.post(process.env.REACT_APP_API_BASE_URL + "/v1/auth/updateProfile", req, {headers:
        {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


