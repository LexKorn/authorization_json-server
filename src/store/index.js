import {createStore, combineReducers} from 'redux';
import contactsReducer from '../reducers/contactsReducer';
import authReducer from '../reducers/authReducer';


const store = createStore(combineReducers({contactsReducer, authReducer}), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;