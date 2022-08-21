import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const Navbar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = (e) => {
        e.preventDefault();
        auth.logout();
        navigate('/');
    }      

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
                <a href="/" className="brand-logo">Книга контактов</a>
                <ul className="right" >       
                    <li><a href='/' onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    );
}