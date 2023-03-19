import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

export const createUser = (user) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/create", user);
    
}

export const createUserRole = (role) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles/create", role);
}

export const updateUserRole = (role) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles/update", role);
}


export const getUserRole = (roleId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles/get/" + roleId);
}

export const createTestPermission = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/per");
}


export const updateUser = (user) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/update", user);
}


export const getUsers = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getUsersBycompany = (companyId) => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/bycompany/" + companyId, {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getAllRoles = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getAllPermissions = () => {
  
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/permissions", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const getUser = (userId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/users/get/" + userId);
}

export const removeUser = (userId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/remove/" + userId);
}
