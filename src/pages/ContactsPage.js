import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {v4 as uuidv4} from 'uuid';

import { AuthContext } from '../context/AuthContext';
import { InputFields } from '../components/InputFields';
import { ContactsList } from '../components/ContactsList';
import { SearchPanel } from '../components/SearchPanel';
import { useMessage } from '../hooks/message.hook';
import { BACK_URL } from '../config/index';
import { ADD_CONTACT, DELETE_CONTACT } from '../store/actions';

import './contactsPage.sass';


export const ContactsPage = () => {
    const {login, userId} = useContext(AuthContext);
    const message = useMessage();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contacts, setContacts] = useState([]);
    const [nameInput, setNameInput] = useState('');
    
    const elems = useSelector(state => state.contacts);
    const dispatch = useDispatch();

    // console.log(elems);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

/*
    // POST contact
    const createContactHandler = async () => {
        if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}

		try {
			const response = await fetch(`${BACK_URL}/contacts`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({ name, phone, id: uuidv4(), owner: userId })                
			});

			const data = await response.json();

			if (response.status !== 200) {
				console.error(data);
			}

			setName('');
			setPhone('');
            // fetchContacts();

		} catch(err) {
			console.error(err.message);
		}
    };
*/
    // ADD contacts by Redux
    const createContactHandler = () => {
        if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}

        dispatch({
            type: ADD_CONTACT,
            payload: {
                name, 
                phone, 
                id: uuidv4(), 
                owner: userId
            }
        });

        setName('');
        setPhone('');
    };

/*
    // GET contact
    useEffect(() => {
		fetchContacts();
	}, [login]);

	const fetchContacts = async () => {
		fetch(`${BACK_URL}/contacts?owner=${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
			.then((json) => json.json())
			.then((data) => {
				setContacts(data);
			})
			.catch((err) => console.error(err))
	};
*/
    // GET contacts by Redux
    const getContacts = (items, term) => {
        return items.filter(item => {
            return item.owner.indexOf(term) > -1;
        });
    };

    const visibleElems = getContacts(elems, userId);


/*
    // DELETE contact
	const removeContactHandler = (id) => {
		fetch(`${BACK_URL}/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }			
		})
			.then((json) => json.json())
			// .then(() => {
			// 	fetchContacts().filter(item => item.id !== id);
			// })
			.catch((err) => console.error(err))
	};
*/

    // DELETE contact by Redux
    const removeContactHandler = (id) => {
        dispatch({
            type: DELETE_CONTACT,
            payload: {
                id: id
            }
        });
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

    const visibleData = searchContacts(visibleElems, nameInput);

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
            <ContactsList 
                contacts={visibleData} 
                handlerDelete={removeContactHandler} />
        </div>
    );
};