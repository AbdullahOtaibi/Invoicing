import { getSecured, postSecured } from '../../../services/ApiClient'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

export const createcompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/create", company);
    
}

export const updatecompany = (company) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/update", company);
    
}


export const getCompanies = () => {
  
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/all");
}

export const getcompany = (companyId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/get/" + companyId);
}

export const removecompany = (companyId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/companies/remove/" + companyId);
}
