import axios from 'axios'



///v1/translations/enabled-languages
export const getEnabledLanguages = () => {
    return axios.get(process.env.REACT_APP_API_BASE_URL + "/v1/translations/enabled-languages");
}