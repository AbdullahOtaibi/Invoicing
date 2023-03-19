import axios from 'axios'


export const getCounters = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/counters/all");
}


