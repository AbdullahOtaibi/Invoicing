import { getSecured } from '../../../services/ApiClient'

export const getArticle = (articleId) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/get/"+ articleId);
}


export const getArticleByAlias = (alias) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/getByAlias/"+ alias);
}

export const getArticlesByCategoryAlias = (alias) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/byCategoryAlias/"+ alias);
}


export const getLatestByCategoryAlias = (alias) => {
    return getSecured(process.env.REACT_APP_API_BASE_URL + "/v1/articles/latest10ByCategoryAlias/"+ alias);
}





