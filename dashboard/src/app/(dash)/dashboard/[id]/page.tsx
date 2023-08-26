'use client'

import React from 'react';
import styles from './page.module.css';
import { useUser } from '@/api-funcs/auth';
import { useRouter } from 'next/navigation';
import { useProject } from '@/api-funcs/dashboard';
import ContentText from './components/ContentText/ContentText';
import Link from 'next/link';
import PageComponent from './components/PageComponent/PageComponent';
import LineChart from './components/LineChart/LineChart';

const Page : React.FC<{ params: { id: string } }> = ({ params }) => {
    
    const { id } = params;
    const router = useRouter();
    

    const { projectData, isProjectLoading } = useProject(id);

    if(isProjectLoading) return;

    if((!isProjectLoading && !projectData)) {
        router.push('/dashboard/auth/login');
        return;
    }



    return (
        <PageComponent title='Overview' direction='row'>
            <div className={styles['preview-box']}>
                <h2>Credentials</h2>
                <ContentText>Client ID: {projectData.clientId}</ContentText>
                <ContentText>Client Secret: <Link className={styles['project-link']} href={`/dashboard/${id}/credentials`}>{projectData.clientSecret ? '******' : 'Generate'}</Link></ContentText>
                <ContentText>Host: <Link className={styles['project-link']} href={`/dashboard/${id}/credentials`}>{projectData.host ? projectData.host : 'Set'}</Link></ContentText>
            </div>
            <div className={`${styles['preview-box']} ${styles['analytics-box']}`}>
                <h2>Analytics</h2>
                <LineChart />
            </div>
        </PageComponent>
    )

}

export default Page;