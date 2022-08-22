import {contacts} from './mock-items';
import {ADD_CONTACT, UPDATE_CONTACT, DELETE_CONTACT} from './actions';

export const contactsReducer = (state = contacts, action) => {
    switch (action.type) {
        case ADD_CONTACT: {
            const elem = action.payload;
            return [...state, elem]
        }
        case UPDATE_CONTACT: {
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
        case DELETE_CONTACT: {
            const {id} = action.payload;
            return [...state.filter(elem => elem.id !== id)]
        }
        default:
            return state
    }
};