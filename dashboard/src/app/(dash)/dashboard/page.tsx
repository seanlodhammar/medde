'use client'

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/api-funcs/auth';
import Projects from '@/app/components/Projects/Projects';
import Messages from '@/app/components/UI/Messages/Messages';
import { useProjects } from '@/api-funcs/dashboard';

const Page = () => {

    const { data: userData, isLoading: userLoading } = useUser();
    const { data, isLoading } = useProjects();
    const router = useRouter();

    const [errors, setErrors] = useState<string[]>([]);

    const reroute = (url: string) => {
        router.push(url);
        return;
    }


    useEffect(() => {
        if((!isLoading && !data) || (!userData && !userLoading)) router.push('/dashboard/auth/login');
    }, [isLoading, data])

    if(isLoading || userLoading) return;

    return (
        <main className={styles['dashboard']}>
            <Messages messages={errors} setMessages={setErrors} />
            <Projects projects={data.projects} reroute={reroute} setErrors={setErrors} />
        </main>
    )
}



export default Page;