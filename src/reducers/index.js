// import {ADD_CONTACT, UPDATE_CONTACT, DELETE_CONTACT, CONTACTS_FETCHING, CONTACTS_FETCHED, CONTACTS_FETCHING_ERROR} from './actions';

const initialState = {
    contacts: [],
    contactsLoadingStatus: 'idle'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONTACTS_FETCHING': {
            return {
                ...state,
                contactsLoadingStatus: 'loading'
            }
        }
        case 'CONTACTS_FETCHED': {
            return {
                ...state,
                contacts: action.payload,
                contactsLoadingStatus: 'idle'
            }
        }
        case 'CONTACTS_FETCHING_ERROR': {
            return {
                ...state,
                contactsLoadingStatus: 'error'
            }
        }
        case 'ADD_CONTACT': {
            const newContactsList = [...state.contacts, action.payload];
            return {
                ...state,
                contacts: newContactsList
            }
        }
        case 'UPDATE_CONTACT': {
            const {id, name, phone} = action.payload;
            return [
                ...state.map(elem => {
                    if (elem.id === id) {
                        return {...elem, name, phone}
                    }
                    return elem
                })
            ]
        }
        case 'DELETE_CONTACT': {
            // const {id} = action.payload;
            // return [...state.filter(elem => elem.id !== id)]
            const newContactsList = state.contacts.filter(item => item.id !== action.payload);
            return {
                ...state,
                contacts: newContactsList
            }
        }
        default: return state
    }
};

export default reducer;