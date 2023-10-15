import { postSecured, getSecured } from '../../../services/ApiClient'


export const getCompanies = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/all");
}

export const getHomePageCompanies = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/homePage");
}

export const getcompany = (id) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/get/" + id);
}



export const createcompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/create", company);
    
}

export const updatecompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/update", company);
    
}

