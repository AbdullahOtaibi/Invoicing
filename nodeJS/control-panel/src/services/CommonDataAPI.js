import axios from 'axios'

export const getColors = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/colors/all");
}
