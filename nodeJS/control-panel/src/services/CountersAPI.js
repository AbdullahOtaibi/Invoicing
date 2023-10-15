import { getSecured } from './ApiClient'

export const getCounters = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/counters/all");
}


