import { getSecured, postSecured } from '../../../services/ApiClient'

export const removeSubscription = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/remove/" + contactId);
}

export const getSubscription = (contactId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/get/" + contactId);

}

export const getSubscriptions = (filters) => {
    console.log("url:" +process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/filter") ;
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/filter", filters);
}


export const getCountSubscriptions = (filter) => {
    
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/count", filter);
    //return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscription/filter", {deleted:false , page:1});
}



export const createSubscription = (SubscriptionObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/create", SubscriptionObj);
}

export const updateSubscription = (SubscriptionObj) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/update", SubscriptionObj);
}

export const searchSubscription = (filters) => {
    return postSecured(process.env.REACT_APP_API_BASE_URL + "/v1/subscriptions/search/" , filters);

}














