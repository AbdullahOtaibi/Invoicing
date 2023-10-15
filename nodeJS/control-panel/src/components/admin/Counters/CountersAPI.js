import { getSecured, postSecured } from '../../../services/ApiClient'


export const createCounter = (counters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/counters/create", counters);
}

export const updateCounter = (counters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/counters/update", counters);
}


export const getCounters = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/counters/all");
}


export const removeCounter = (countersId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/counters/remove/" + countersId);
}
