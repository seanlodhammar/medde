'use client'



import React from 'react';
import styles from './page.module.css';
import AuthWrapper from '@/app/components/AuthWrapper/AuthWrapper';
import { useUser } from '@/api-funcs/auth';
import { useRouter } from 'next/navigation';

const Page : React.FC<{ params: { id: string } }> = ({ params }) => {

    const authTypes : { [props: string]: string } = { login: 'Login', signup: 'Signup' };

    const router = useRouter();

    const { data, isLoading } = useUser();

    if (isLoading) return;

    if (data) {
        router.push('/dashboard'); 
        return;
    }
    
    {
        return (
            <main className={styles['wrapper']}>
                <AuthWrapper type={authTypes[params.id]} />
            </main>
        )  
    }

}


export default Page;