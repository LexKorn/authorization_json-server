const initialState = {
    auths: [],
    authLoadingStatus: 'idle'
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_FETCHING': {
            return {
                ...state,
                authLoadingStatus: 'loading'
            }
        }
        case 'AUTH_FETCHED': {
            return {
                ...state,
                auths: action.payload,
                authLoadingStatus: 'idle'
            }
        }
        case 'AUTH_FETCHING_ERROR': {
            return {
                ...state,
                authLoadingStatus: 'error'
            }
        }
        case 'ADD_AUTH': {
            return {
                ...state,
                auths: [...state.auths, action.payload]
            }
        }
        default: return state
    }
};

export default authReducer;