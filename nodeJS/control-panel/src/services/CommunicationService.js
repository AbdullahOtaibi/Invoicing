import { getSecured, postSecured } from './ApiClient'

export const sendEmail = (data) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/mailer/send-email", data);
}
