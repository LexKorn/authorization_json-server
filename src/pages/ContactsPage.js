import React, { useState, useEffect, useContext, useCallback } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useSelector, useDispatch } from 'react-redux';

import { AuthContext } from '../context/AuthContext';
import { InputFields } from '../components/InputFields';
import { ContactsList } from '../components/ContactsList';
import { SearchPanel } from '../components/SearchPanel';
import { Loader } from '../components/Loader';
import { useMessage } from '../hooks/message.hook';
import { BACK_URL } from '../config/index';
import {useHttp} from '../hooks/http.hook';
import {CONTACTS_FETCHING, CONTACTS_FETCHED, CONTACTS_FETCHING_ERROR, ADD_CONTACT, UPDATE_CONTACT, DELETE_CONTACT} from '../actions';

import './contactsPage.sass';


export const ContactsPage = () => {
    const {login, userId} = useContext(AuthContext);
    const message = useMessage();
    const {request} = useHttp();

    const {contacts: elems, contactsLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [nameInput, setNameInput] = useState('');

    useEffect(() => {
        window.M.updateTextFields();
    }, []);


    // GET contact
    useEffect(() => {
		fetchContacts();
	}, [userId]);

	const fetchContacts = async () => {
        dispatch(CONTACTS_FETCHING());
        request(`${BACK_URL}/contacts?owner=${userId}`)
            .then(data => dispatch(CONTACTS_FETCHED(data)))
            .catch(() => dispatch(CONTACTS_FETCHING_ERROR()));
	};

    if (contactsLoadingStatus === 'loading') {
        return <Loader />
    } else if (contactsLoadingStatus === 'error') {
        return <h5 className='center'>Ошибка загрузки</h5>
    }

    const renderContactsList = (arr, handler) => {
        if (arr.length === 0) {
            return <h5 className='center'>Контактов пока нет</h5>
        }

        return <ContactsList contacts={arr} handler={handler} /> 
    };


    // POST contact
    const createContactHandler = async () => {
        if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}

        request(`${BACK_URL}/contacts`, 'POST', { name, phone, id: uuidv4(), owner: userId })
            .then(data => dispatch(ADD_CONTACT(data)))
            .catch(err => console.error(err.message));

        setName('');
        setPhone('');
        fetchContacts();
    };


    // DELETE contact
	const removeContactHandler = (id) => {
        request(`${BACK_URL}/contacts/${id}`, 'DELETE')
            .then(dispatch(DELETE_CONTACT(id)))
	};


    // SEARCH contact
    const searchContacts = (items, term) => {
        if (term.length === 0) {
            return items;
        }

        return items.filter(item => {
            return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    };

    const visibleData = searchContacts(elems, nameInput);
    const elements = renderContactsList(visibleData, removeContactHandler);
    

    return (
        <div>
            <InputFields 
                name={name} 
                setName={setName} 
                phone={phone} 
                setPhone={setPhone} 
                handler={createContactHandler} 
                title='Создай контакт'
                button='Создать' /> 
            <SearchPanel name={nameInput} setName={setNameInput} />
            {elements}
        </div>
    );
};