// export const ADD_CONTACT = 'ADD_CONTACT';
// export const UPDATE_CONTACT = 'UPDATE_CONTACT';
// export const DELETE_CONTACT = 'DELETE_CONTACT';

export const CONTACTS_FETCHING = () => {
    return {
        type: 'CONTACTS_FETCHING'
    }
};

export const CONTACTS_FETCHED = (contacts) => {
    return {
        type: 'CONTACTS_FETCHED',
        payload: contacts
    }
};

export const CONTACTS_FETCHING_ERROR = () => {
    return {
        type: 'CONTACTS_FETCHING_ERROR'
    }
};

export const ADD_CONTACT = (contact) => {
    return {
        type: 'ADD_CONTACT',
        payload: contact
    }
};

export const UPDATE_CONTACT = (contact) => {
    return {
        type: 'UPDATE_CONTACT',
        payload: contact
    }
};

export const DELETE_CONTACT = (id) => {
    return {
        type: 'DELETE_CONTACT',
        payload: id
    }
};