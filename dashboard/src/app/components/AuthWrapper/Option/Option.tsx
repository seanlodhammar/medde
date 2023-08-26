'use client';

import React from 'react';
import styles from './Option.module.css';
import Link from 'next/link';

const Option : React.FC<{ type: string }> = ({ type }) => {

    return (
        <div className={styles['option']}>
            <h2>Want to { type === 'Login' ? <Link id={styles['other-link']} href='/dashboard/auth/signup'>signup</Link> : <Link id={styles['other-link']} href='/dashboard/auth/login'>login</Link> } instead?</h2>
        </div>
    )
}

export default Option;