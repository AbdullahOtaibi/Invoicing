import { getSecured, postSecured } from '../../../services/ApiClient'


export const createCountry = (country) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/create", country);
}

export const updateCountry = (country) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/update", country);
}


export const getCountries = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/all");
}

export const initCountries = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/init");
}



export const removeCountry = (countryCode) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/countries/remove/" + countryCode);
}
