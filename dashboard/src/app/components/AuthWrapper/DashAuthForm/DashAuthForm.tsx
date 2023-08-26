'use client'
import React, { useState } from 'react';
import styles from './DashAuthForm.module.css';
import { postUser } from '@/api-funcs/auth';
import { useSWRConfig } from 'swr';

const DashAuthForm : React.FC<{ type: string }> = ({ type }) => {

    const { mutate } = useSWRConfig();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const formHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            switch(type) {
                case 'Login':
                    const loginRes = await postUser('login', email, password);
                    if(!loginRes || loginRes !== true) {
                        return;
                    }
                    mutate('/auth/user');
                    break;
                case 'Signup':
                    const signupRes = await postUser('signup', email, password);
                    if(!signupRes || signupRes !== true) {
                        return;
                    }
                    mutate('/auth/user');
                    break;
            }
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <form className={styles['dash-auth-form']} title='Authentication Form' onSubmit={formHandler}>
            <h2 id={styles['form-title']}>{type}</h2>
            <div className={styles['input-wrapper']}>
                <input className={styles['auth-input']} id={styles['input-email']} value={email} placeholder='Email' type='text' onChange={emailHandler} />
                <input className={styles['auth-input']} id={styles['input-password']} value={password} placeholder='Password' type='password' onChange={passwordHandler} />
            </div>
            
            <button type='submit' id={styles['submit-btn']}>Submit</button>
        </form>
    )
}

export default DashAuthForm;