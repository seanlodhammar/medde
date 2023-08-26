'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import PageComponent from '../components/PageComponent/PageComponent';
import CollaboratorList from './components/CollaboratorList/CollaboratorList';
import { useProject } from '@/api-funcs/dashboard';
import { useUser } from '@/api-funcs/auth';
import { User } from '@/types/auth-types';
import { SingularProject } from '@/types/dashboard-types';
import Dropdown from '@/app/components/UI/Dropdown/Dropdown';
import AddCollaboratorForm from './components/CollaboratorList/AddCollaboratorForm/AddCollaboratorForm';

const Page : React.FC<{ params: { id: string } }> = ({ params: { id } }) => {

    const { projectData, isProjectLoading }: { projectData: SingularProject; isProjectLoading: boolean } = useProject(id);
    const { data: { user } , isLoading }: { data: { user: User }; isLoading: boolean } = useUser();
    const [showCollaboratorForm, setShowCollaboratorForm] = useState<boolean>(false);


    if(isProjectLoading || isLoading) return;
    
    if((!isProjectLoading && !projectData) || (!isLoading && !user)) return;

    const handleCollaboratorForm = () => {
        if(showCollaboratorForm) {
            setShowCollaboratorForm(false);
            return;
        }
        setShowCollaboratorForm(true);
        return;
    }


    
    return (
        <PageComponent title='Collaborators'>
            { showCollaboratorForm ? <Dropdown onCancel={handleCollaboratorForm}>
                <AddCollaboratorForm projectId={id} handleCollaboratorForm={handleCollaboratorForm}/>
            </Dropdown> : '' }
            { projectData.permission === 'Owner' || projectData.permission === 'Admin' ? <button id={styles['add-btn']} onClick={handleCollaboratorForm}>Add new member</button> : ''}
            <CollaboratorList projectData={projectData} />
        </PageComponent>
    )
}

export default Page;