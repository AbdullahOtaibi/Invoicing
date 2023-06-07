import axios from 'axios'





export const getSettings = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/settings/all");
}


