import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InputFields } from '../components/InputFields';
import { BACK_URL } from '../config/index';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';


export function EditPage() {
	const { id } = useParams();
	const {userId} = useContext(AuthContext);
	const message = useMessage();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');	

    const navigate = useNavigate();

	useEffect(() => {
        window.M.updateTextFields();
    }, []);

	useEffect(() => {
		fetch(`${BACK_URL}/contacts/${id}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
                'Authorization': `Bearer ${userId}`,
			}
		})
			.then((json) => json.json())
			.then((data) => {
				setName(data.name);
				setPhone(data.phone);
			})
			.catch((err) => console.error(err))
	}, [id, userId]);

	const editContactHandler = async () => {
		if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}
		
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