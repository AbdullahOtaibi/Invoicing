import { getSecured } from '../../../services/ApiClient'
export const getColors = () => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/colors/all");
}
