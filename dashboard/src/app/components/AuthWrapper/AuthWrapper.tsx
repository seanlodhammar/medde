'use client'

import React from 'react';
import styles from './AuthWrapper.module.css';
import DashAuthForm from './DashAuthForm/DashAuthForm';
import Option from './Option/Option';

const AuthWrapper : React.FC<{ type: string }> = ({ type }) => {
    return (
        <div className={styles['auth-wrapper']}>
            <DashAuthForm type={type} />
            <Option type={type} />
        </div>
    )
}

export default AuthWrapper;