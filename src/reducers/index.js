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
            const newContactsList = state.contacts.map(item => {
                if (item.id === id) {
                    return {...item, name, phone}
                }
                return item
            });
            return {
                ...state,
                contacts: newContactsList
            }
        }
        case 'DELETE_CONTACT': {
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