import { combineReducers } from "redux";
import {contactsReducer} from './contactsReducer';

export const reducer = combineReducers({
    contacts: contactsReducer
});