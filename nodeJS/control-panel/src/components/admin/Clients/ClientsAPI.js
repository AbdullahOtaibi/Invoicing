import { getSecured, postSecured, httpGet } from '../../../services/ApiClient'

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
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles/get/" + roleId);
}

export const createTestPermission = () => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/per");
}


export const updateUser = (user) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/update", user);
}


export const getUsers = () => {
  
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/allClients");
}

export const getUsersBycompany = (companyId) => {
  
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/bycompany/" + companyId);
}


export const getAllRoles = () => {
  
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/roles");
}

export const getAllPermissions = () => {
  
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/permissions");
}


export const getUser = (userId) => {
    return httpGet(process.env.REACT_APP_API_BASE_URL + "/v1/users/get/" + userId);
}

export const removeUser = (userId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/users/remove/" + userId);
}
