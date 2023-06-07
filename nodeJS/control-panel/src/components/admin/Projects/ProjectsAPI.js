import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createProject = (project) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/projects/create", project);
    
}

export const updateProject = (project) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/projects/update", project);
}


export const getProjects = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}

export const getProject = (projectId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/get/" + projectId);
}

export const removeProject = (projectId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/projects/remove/" + projectId);
}
