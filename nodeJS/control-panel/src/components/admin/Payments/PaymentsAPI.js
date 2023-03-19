import { getSecured, postSecured } from '../../../services/ApiClient'

export const getPayments = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/payments/all", filters);
}

export const getOutstandingPayments = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/payments/outstanding/filter", filters);
}