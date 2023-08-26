'use client'
import React from 'react';
import styles from './PageLoading.module.css';
import Image from 'next/image';

const PageLoading = () => {
    return (
        <div className={styles['page-loading']}>
            <Image src='/medde-altered.png' priority placeholder='empty' height='200' width='400' alt='Medde Logo' id={styles['logo']} />
        </div>
    )
}

export default PageLoading;