import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { InputFields } from '../components/InputFields';
import { BACK_URL } from '../config/index';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { useHttp } from '../hooks/http.hook';
import { UPDATE_CONTACT } from '../actions';


export function EditPage() {
	const { id } = useParams();
	const {userId} = useContext(AuthContext);
	const message = useMessage();
	const {request} = useHttp();

	const elems = useSelector(state => state.contacts);
    const dispatch = useDispatch();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');	

    const navigate = useNavigate();

	useEffect(() => {
        window.M.updateTextFields();
    }, []);

	useEffect(() => {
		request(`${BACK_URL}/contacts/${id}`)
			.then((data) => {
				setName(data.name);
				setPhone(data.phone);
			})
			.catch((err) => console.error(err))

		// fetch(`${BACK_URL}/contacts/${id}`, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-type': 'application/json',
        //         'Authorization': `Bearer ${userId}`,
		// 	}
		// })
		// 	.then((json) => json.json())
		// 	.then((data) => {
		// 		setName(data.name);
		// 		setPhone(data.phone);
		// 	})
		// 	.catch((err) => console.error(err))
	}, [id]);

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
			/*
		try {
			const response = await fetch(`${BACK_URL}/contacts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					'Authorization': `Bearer ${userId}`
				},
				body: JSON.stringify({ name, phone, owner: userId }),
			});

			const data = await response.json();

			if (response.status !== 200) {
				return console.error(data);
			}
            navigate('/');

		} catch (err) {
			console.error(err);
		}
		*/
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