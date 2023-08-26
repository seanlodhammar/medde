import React, { useRef, useState } from 'react';
import styles from './Sidebar.module.css';
import SidebarLink from './SidebarLink/SidebarLink';;
import { useProject } from '@/api-funcs/dashboard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Dropdown from '@/app/components/UI/Dropdown/Dropdown';
import { deleteProject } from '@/api-funcs/dashboard';
import { ProjectInterface, SingularProject } from '@/types/dashboard-types';

const Sidebar : React.FC<{ id: string; reroute: (route: string) => void; }>= ({ id, reroute }) => {

    const [showDeletionDropdown, setShowDeletionDropdown] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>('');

    const { projectData, isProjectLoading }: { projectData: SingularProject, isProjectLoading: boolean } = useProject(id);
    const pathname = usePathname();

    if(isProjectLoading) return;

    if(!isProjectLoading && !projectData) {
        reroute('/dashboard/auth/login');
        return;
    }

    const showDropdown = () => {
        setShowDeletionDropdown(true);
    }

    const hideDropdown = () => {
        setProjectName('');
        setShowDeletionDropdown(false);
    }

    const projectNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    }

    const nameConditionFulfilled = projectName === projectData.name;
    

    const deleteProjectHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!nameConditionFulfilled) {
            return;
        }
        const res = await deleteProject(projectData._id);
        if(!res) {
            return;
        }
        reroute('/dashboard');
    }

    return (
        <>
            { showDeletionDropdown ? 
            <Dropdown onCancel={hideDropdown}>
                <form className={styles['project-deletion-form']} title='Project Deletion Form' onSubmit={deleteProjectHandler}>
                    <h2>Delete Project</h2>
                    <label htmlFor='project-name-input' id={styles['project-name-label']}>Type <mark id={styles['deletion-label-mark']}>{projectData.name}</mark> to continue</label>
                    <input value={projectName} onChange={projectNameHandler} id={styles['project-name-input']} name='project-name-input' placeholder={projectData.name} />
                    <div className={styles['button-wrapper']}>
                        <button className={`${styles['deletion-form-btn']} ${ !nameConditionFulfilled ? styles['condition-not-met'] : ''}`} id={styles['deletion-form-submit-btn']} type='submit'>Submit</button>
                        <button className={styles['deletion-form-btn']} id={styles['deletion-form-cancel-btn']} onClick={hideDropdown} type='button'>Cancel</button>
                    </div>
                </form>
            </Dropdown> : ''}
            <div className={styles['sidebar']}>
                <div className={styles['top-wrapper']}>
                    <Link href='/dashboard' id={styles['return-link']}>
                        <div id={styles['link-text-wrapper']}>
                            <i className={`bi bi-arrow-left`} id={styles['arrow-symbol']}></i>
                            Return to projects
                        </div>
                    </Link>
                    <div className={styles['inner-wrapper']}>
                        <h2>{ projectData.name }</h2>
                    </div>
                    <nav className={styles['link-wrapper']}>
                        <SidebarLink href={`/dashboard/${id}`} pathname={pathname}>Overview</SidebarLink>
                        <SidebarLink href={`/dashboard/${id}/credentials`} pathname={pathname}>Credentials</SidebarLink>
                        <SidebarLink href={`/dashboard/${id}/appearance`} pathname={pathname}>Appearance</SidebarLink>
                        <SidebarLink href={`/dashboard/${id}/collaborators`} pathname={pathname}>Collaborators</SidebarLink>
                    </nav>
                </div>
                <div className={styles['bottom-wrapper']}>
                    <button className={styles['delete-btn']} onClick={showDropdown}>
                        <i className="bi bi-trash3"></i>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar;