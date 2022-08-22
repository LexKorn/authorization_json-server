import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { InputFields } from '../components/InputFields';
import { BACK_URL } from '../config/index';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { UPDATE_CONTACT } from '../store/actions';


export function EditPage() {
	const { id } = useParams();
	const {userId} = useContext(AuthContext);
	const message = useMessage();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');	

	const elems = useSelector(state => state.contacts);
    const dispatch = useDispatch();

    const navigate = useNavigate();

	useEffect(() => {
        window.M.updateTextFields();
    }, []);

	/*
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
*/

	const getContact = (items, term) => {
        return items.filter(item => {
            return item.id.indexOf(term) > -1;
        });
    };

	const contact = getContact(elems, id);

	useEffect(() => {
		setName(contact[0].name);
		setPhone(contact[0].phone);
	}, [id]);


/*
	const editContactHandler = async () => {
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
*/

	const editContactHandler = (id) => {
		if (!name.trim() || !phone.trim()) {
			return message('Все поля обязательны для заполнения');
		}

		dispatch({
			type: UPDATE_CONTACT,
			payload: {
				name, 
				phone, 
				id: contact[0].id
			}
		});

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