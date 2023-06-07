import axios from 'axios'

export const getProject = (projectId) => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/get/"+ projectId);
}

export const getAllProjects = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/all");
}

export const getActiveProjects = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/active");
}

export const getPastProjects = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/projects/past");
}





