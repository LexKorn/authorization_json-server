export const AUTH_FETCHING = () => {
    return {
        type: 'AUTH_FETCHING'
    }
};

export const AUTH_FETCHED = (auths) => {
    return {
        type: 'AUTH_FETCHED',
        payload: auths
    }
};

export const AUTH_FETCHING_ERROR = () => {
    return {
        type: 'AUTH_FETCHING_ERROR'
    }
};

export const ADD_AUTH = (auth) => {
    return {
        type: 'ADD_AUTH',
        payload: auth
    }
};