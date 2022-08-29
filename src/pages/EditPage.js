import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { InputFields } from '../components/InputFields';
import { BACK_URL } from '../config/index';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { useHttp } from '../hooks/http.hook';
import { UPDATE_CONTACT } from '../actions/contactsActions';


export function EditPage() {
	const { id } = useParams();
	const {userId} = useContext(AuthContext);
	const message = useMessage();
	const {request} = useHttp();

    const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');	

    const navigate = useNavigate();

	useEffect(() => {
		request(`${BACK_URL}/contacts/${id}`)
			.then((data) => {
				setName(data.name);
				setPhone(data.phone);
			})
			.catch((err) => console.error(err))
	}, []);

	const editContactHandler = async () => {
		if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}

		request(`${BACK_URL}/contacts/${id}`, 'PUT', { name, phone, owner: userId })
			.then(data => {
				dispatch(UPDATE_CONTACT(data));
			})
			.catch(err => console.error(err.message));

		navigate('/');
	};

	return (
		<div>
			<InputFields 
				name={name} 
				setName={setName} 
				phone={phone} 
				setPhone={setPhone} 
				handler={editContactHandler}
				title='Редактирование контакта'
				button='Изменить' />  
		</div>
	);
}