'use client';

import React from 'react';
import styles from './layout.module.css';
import { useUser } from '@/api-funcs/auth';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar/Sidebar';

const ProjectDashLayout : React.FC<{ children: React.ReactNode; params: { id: string } }> = ({ children, params}) => {

    const router = useRouter();
    const { data, isLoading } = useUser();

    if(isLoading) return;

    if((!isLoading && !data)) {
        router.push('/dashboard/auth/login');
        return;
    }

    const reroute = (route: string) => {
        router.push(route);
    }

    return (
        <main className={styles['project-layout']}>
            <Sidebar reroute={reroute} id={params.id}  />
            {children}
        </main>
    )
}

export default ProjectDashLayout;