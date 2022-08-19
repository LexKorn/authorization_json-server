import React, { useState, useEffect, useContext } from 'react';
import {v4 as uuidv4} from 'uuid';

import { AuthContext } from '../context/AuthContext';
import { InputFields } from '../components/InputFields';
import { ContactsList } from '../components/ContactsList';
import { useMessage } from '../hooks/message.hook';
import { BACK_URL } from '../config/index';

import './contactsPage.sass';


export const ContactsPage = () => {
    const {login, userId} = useContext(AuthContext);
    const message = useMessage();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);


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
            fetchContacts();

		} catch(err) {
			console.error(err.message);
		}
    };


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


    // DELETE contact
	const removeContactHandler = (id) => {
		fetch(`${BACK_URL}/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }			
		})
			.then((json) => json.json())
			.then(() => {
				fetchContacts().filter(item => item.id !== id);
			})
			.catch((err) => console.error(err))
	};


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
            <ContactsList contacts={contacts} handler={removeContactHandler} />
        </div>
    );
};