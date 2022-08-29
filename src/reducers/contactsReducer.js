const initialState = {
    contacts: [],
    contactsLoadingStatus: 'idle'
};

const contactsReducer = (state = initialState, action) => {
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
            return {
                ...state,
                contacts: [...state.contacts, action.payload]
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
            return {
                ...state,
                contacts: state.contacts.filter(item => item.id !== action.payload)
            }
        }
        default: return state
    }
};

export default contactsReducer;