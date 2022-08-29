import React, { useContext, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';
import validator from 'validator';
import { useDispatch } from 'react-redux';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { AuthInputFields } from '../components/AuthInputFields';
import { BACK_URL } from '../config/index';
import {AUTH_FETCHING, AUTH_FETCHED, AUTH_FETCHING_ERROR, ADD_AUTH} from '../actions/authActions';


export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', 
        password: ''
    });

    const dispatch = useDispatch();

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const registerHandler = async () => {
        try {
            if (!validator.isEmail(`${form.email}`)) {
                return message('Некорректный ввод email');
            }

            // if (!validator.isStrongPassword(`${form.password}`)) 
            if (!validator.isLength(`${form.password}`, {min: 5, max: 8})) {
                return message('Пароль должен быть не менее 5 символов и не более 8 символов');
            }

            dispatch(AUTH_FETCHING());

            const data = await request(`${BACK_URL}/register?email=${form.email}`)
                .then(data => dispatch(AUTH_FETCHED(data)))
                .catch(() => dispatch(AUTH_FETCHING_ERROR()));

            if (data.payload.length > 0) {
                return message('Такой пользователь уже существует');
            }
            
            const hashedPassword = await bcrypt.hash(form.password, 5);
            await request(`${BACK_URL}/register`, 'POST', {...form, password: hashedPassword, id: uuidv4()})
                .then(data => {
                    dispatch(ADD_AUTH(data));
                    message('Пользователь создан');
                })
                .catch(err => console.log(err.message))          
            
        } catch(err) {
            message('При регистрации произошла ошибка(');
        }
    }

    const loginHandler = async (req, res) => {
        try {
            const data = await request(`${BACK_URL}/register?email=${form.email}`);

            if (data.length === 0) {
                return message('Такого пользователья нет'); 
            }

            const isMatch = await bcrypt.compare(form.password, data[0].password);
            if (!isMatch) {
                return message('Неверный пароль, попробуйте снова');
            }

            auth.login(data[0].id);
            
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
                                <AuthInputFields title="email" value={form.email} handler={changeHandler} />
                                <AuthInputFields title="password" value={form.password} handler={changeHandler} />
                            </div>
                        </div>
                        <div className="card-action">
                            <button 
                                className='btn yellow darken-4' 
                                style={{marginRight: 10}}  
                                onClick={loginHandler}
                                disabled={loading}
                                >Войти
                            </button>                              
                            <button 
                                className='btn grey lighten-1 black-text'
                                onClick={registerHandler}
                                disabled={loading}
                                >Регистрация
                            </button>
                        </div>
                </div>
            </div>            
        </div>
    );
}