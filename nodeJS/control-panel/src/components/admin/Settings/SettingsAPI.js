import { getSecured, postSecured } from '../../../services/ApiClient'


export const createSettings = (settings) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/create", settings);
}

export const updateSettings = (settings) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/update", settings);
}


export const getSettings = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/all");
}


export const removeSettings = (settingsId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/settings/remove/" + settingsId);
}

export const generateSiteMap = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/sitemap/generate");
}

