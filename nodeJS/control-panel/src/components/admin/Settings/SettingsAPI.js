import axios from 'axios'
import { getSecured, postSecured } from '../../../services/ApiClient'


export const createSettings = (settings) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/create", settings);
}

export const updateSettings = (settings) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/update", settings);
}


export const getSettings = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/settings/all", {headers:
    {"authorization": "Bearer " + localStorage.getItem("jwt")}, crossdomain:true});
}


export const removeSettings = (settingsId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/remove/" + settingsId);
}

export const generateSiteMap = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/sitemap/generate");
}

