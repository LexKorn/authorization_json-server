import React, { useContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';


export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', 
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    let validationSchema = Yup.object({
        email: Yup.string()
            .required('Обязательное поле')
            .email('Неверный email'),
        password: Yup.string()
            .required('Обязательное поле')
            .min(3, 'минимум 3 символа')
    });

    // type form = InferType<typeof validationSchema>;

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
        // setForm(validationSchema.validate({...form, [event.target.name]: event.target.value}));
    }

    const registerHandler = async () => {
        try {
            const data = await request(`http://localhost:3001/register?email=${form.email}`);

            if (data.length > 0) {
                return message('Такой пользователь уже существует');
            }
            
            const hashedPassword = await bcrypt.hash(form.password, 5);
            await request('http://localhost:3001/register', 'POST', {...form, password: hashedPassword, id: uuidv4()});
            message('Пользователь создан');
            
        } catch(err) {
            message('При регистрации произошла ошибка(');
        }
    }

    const loginHandler = async (req, res) => {
        try {
            const data = await request(`http://localhost:3001/register?email=${form.email}`);

            if (data.length === 0) {
                return message('Такого пользователья нет'); 
            }

            const isMatch = await bcrypt.compare(form.password, data[0].password);
            if (!isMatch) {
                return message('Неверный пароль, попробуйте снова');
            }
            
            // const user = await request('http://localhost:3001/login', 'POST', {...form, id: uuidv4()});

            auth.login(data[0].id);
            message('Вход разрешен!');
            
        } catch(err) {
            message('При входе произошла ошибка(');
        }
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h1>Вход в книгу контактов</h1>
                    <div className="card blue darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Авторизация</span>
                            <div>
                                <div className="input-field">
                                    <input 
                                        placeholder="Введите email" 
                                        id="email" 
                                        type="text" 
                                        name='email'
                                        className='yellow-input'
                                        value={form.email}
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor='email'>Email</label>
                                </div>
                                <div className="input-field">
                                    <input 
                                        placeholder="Введите пароль" 
                                        id="email" 
                                        type="password" 
                                        name='password'
                                        className='yellow-input'
                                        value={form.password}
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor='email'>Пароль</label>
                                </div>

                            </div>
                        </div>
                        <div className="card-action">
                            <button 
                                className='btn yellow darken-4' 
                                style={{marginRight: 10}}  
                                onClick={loginHandler}
                                disabled={loading}
                            >  
                                    Войти
                            </button>                              
                            <button 
                                className='btn grey lighten-1 black-text'
                                onClick={registerHandler}
                                disabled={loading}
                            >
                                    Регистрация
                            </button>
                        </div>
                </div>
            </div>            
        </div>
    );
}