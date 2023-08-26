import React from 'react';
import styles from './Convenience.module.css';
import Link from 'next/link';

const Convenience = () => {
    return (
        <section className={styles['convenience']}>
            <div className={styles['text-wrapper']}>
                <h2 className={styles['heading']}>One click and you're rolling</h2>
                <h3 className={styles['incentive']}>
                    Make your on-site messaging hassle-free with Medde.
                    <br></br>
                    <br></br>
                    We make it easy for developers to implement messaging into their site no matter their skill level.
                    With easy to read documentation, custom components and an API wrapper, you have all of the information and tools you need.
                </h3>
                <div className={styles['link-wrapper']}>
                    <Link href='/docs' className={styles['link-btn']}>Read the docs</Link>
                    <Link href='/npm' className={styles['link-btn']}>NPM Page</Link>
                </div>
            </div>
        </section>
    )
}

export default Convenience;