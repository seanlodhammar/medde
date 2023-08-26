'use client'

import React from 'react';
import styles from './DashHeader.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { postLogout, useUser } from '@/api-funcs/auth';
import { useSWRConfig } from 'swr';

const DashHeader = () => {

    const { data, isLoading } = useUser();
    const { mutate } = useSWRConfig();

    const handleClick = async() => {
        try {
            const response = await postLogout();
            if(!response) {
                return;
            }
            mutate('/auth/user');
        } catch (e) {
            return;
        }
    }

    if(isLoading) return;

    return (
        <header className={styles['header']}>
            <div className={styles['left']}>
                <Link href='/' className={styles['logo-link-wrapper']} draggable='false'>
                    <Image src='/medde-altered.png' height='200' quality='100' draggable='false' width='400' alt='Medde Logo' placeholder='empty' priority className={styles['logo']} />
                </Link>
                { data ? <>
                    <h3 id={styles['user-email']}>{data.user.email}</h3>
                </> : ''}
            </div>
            <div className={styles['right']}>
                { data ? <button id={styles['logout-btn']} onClick={handleClick}>Logout</button> : ''}
            </div>
        </header>
    )
}

export default DashHeader;