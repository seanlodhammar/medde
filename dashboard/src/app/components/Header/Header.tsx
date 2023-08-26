'use client'

import React, { useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap';
import { useUser } from '@/api-funcs/auth';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CSSPlugin)

const Header : React.FC = () => {

    const header = useRef(null);

    const { data, isLoading } = useUser();

    useEffect(() => {
        gsap.to(header.current, {
            scrollTrigger: {
                trigger: header.current,
                start: '180px 15%',
                toggleActions: 'restart none none reset',
            },
            background: 'linear-gradient(135deg, #AA4FE1 0%, #353987 100%)',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            duration: 0.00001,
        })
    }, [header])

    return (
        <header className={`${styles['header']}`} ref={header}>
            <Image draggable='false' src='/medde-altered.png' placeholder='empty' width={400} height={200} alt='Medde Logo' priority className={styles['logo']} />
            <div className={styles['links']}>
                <Link href={ data ? '/dashboard' : '/dashboard/auth/login' } className={styles['btn']}>Dashboard</Link>
            </div>
        </header>
    )
}

export default Header;