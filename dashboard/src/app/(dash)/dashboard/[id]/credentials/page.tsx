'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import PageComponent from '../components/PageComponent/PageComponent';
import { useRouter } from 'next/navigation';
import { generateSecret, putHost, useProject } from '@/api-funcs/dashboard';
import ContentText from '../components/ContentText/ContentText';
import CopyBtn from '@/app/components/UI/CopyBtn/CopyBtn';
import Dropdown from '@/app/components/UI/Dropdown/Dropdown';

const Page : React.FC<{ params: { id: string }}> = ({ params }) => {

    const { id } = params;

    const router = useRouter();

    const { projectData, isProjectLoading } = useProject(id);
    const [showRegnerationDropdown, setShowRegenerationDropdown] = useState<boolean>(false);
    const [clientSecret, setClientSecret] = useState<string>('');

    const [hostInput, setHostInput] = useState<string>('');
    const [hostError, setHostError] = useState<string>('');

    useEffect(() => {
        if(projectData && projectData.host) {
            setHostInput(projectData.host);
        }
    }, [projectData])

    if (isProjectLoading) return;

    if(!isProjectLoading && !projectData) {
        router.push('/dashboard/auth/login');
    };

    const showRegen = async() => {
        if(showRegnerationDropdown) {
            setShowRegenerationDropdown(false);
            return;
        }

        setShowRegenerationDropdown(true);
    }

    const fetchClientSecret = async() => {
        try {
            const res = await generateSecret(projectData._id);
            if(!res) {
                return;
            }
            setClientSecret(res);
        } catch (e) {
            console.log(e);
        }
    }

    const hostInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(hostError.length > 0) {
            setHostError('');
        }

        setHostInput(e.target.value);
    }

    const hostSubmissionHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await putHost(projectData._id, hostInput);
            if(typeof res === 'string') {
                setHostError(res);
                setTimeout(() => {
                    setHostError('');
                }, 2000)
                return;
            }
            setHostError('');
            return;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    return (
        <PageComponent title='Credentials'>
            {showRegnerationDropdown ? 
            <Dropdown onCancel={showRegen} type='sensitive' projectData={projectData} onFormCompletion={fetchClientSecret} sensitiveFormTitle='Regenerate Client Secret'>
                <div className={styles['client-secret-modal']}>
                    <h2 id={styles['client-secret-title']}>Client Secret</h2>
                    <h4 id={styles['client-secret-text']}>{clientSecret}</h4>
                    <CopyBtn copyData={clientSecret} />
                    <h4 id={styles['client-secret-disclaimer']}>Make sure to store this and never share it publicly.</h4>
                </div>
            </Dropdown> : ''}
            <div className={styles['page-info-wrapper']}>
                <div className={`${styles['info-div']} ${styles['client-id']}`}>
                    <h3>Client ID</h3>
                    <ContentText>{projectData.clientId}</ContentText>
                    <CopyBtn copyData={projectData.clientId} />
                </div>
                <div className={`${styles['info-div']} ${styles['client-secret']}`}>
                    <h3>Client Secret</h3>
                    <ContentText>{projectData.clientSecret || clientSecret ? '*******' : 'None'}</ContentText>
                    <button className={styles['div-btn']} onClick={showRegen}>
                        { projectData.clientSecret || clientSecret ? 'Regenerate' : 'Generate' }
                    </button>
                </div>
                <div className={`${styles['info-div']} ${styles['host']}`}>
                    <h3>Host</h3>
                    <form title='Set Host' className={styles['host-form']} onSubmit={hostSubmissionHandler}>
                        <input id={styles['host-input']} value={hostInput} onChange={hostInputHandler}/>
                        {hostError ? <h4 id={styles['host-error']}>{hostError}</h4> : '' }
                        <button className={styles['div-btn']}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>


        </PageComponent>
    )
}

export default Page;