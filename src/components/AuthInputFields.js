import { useEffect } from 'react';

export const AuthInputFields = ({title, value, handler}) => {
    useEffect(() => {
        window.M.updateTextFields();
    }, []);
    
    return (
        <>
            <div className="input-field">
                <input 
                    placeholder={`Введите ${title}`} 
                    id={title} 
                    type={title} 
                    name={title}
                    className='yellow-input'
                    title={value}
                    onChange={handler}
                />
                <label htmlFor={title}>{title}</label>
            </div>
        </>
    );
};