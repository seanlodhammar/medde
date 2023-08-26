import React from 'react';
import styles from './Project.module.css';

export const CreateProject : React.FC<{ create: () => void; }> = ({ create }) => {
    return (
        <button className={`${styles['project']} ${styles['create-project']}`} onClick={create}>
            <i className="bi bi-plus-lg" id={styles['plus-icon']}></i>
            <h3 id={styles['new-project-text']}>Create new project</h3>
        </button>
    )
}

const Project : React.FC<{ projectId: string; projectName: string; permission: 'Support' | 'Admin' | 'Developer' | 'Owner'; createdAt: string; reroute: (url: string) => void; }> = ({ projectId, projectName, createdAt, reroute, permission }) => {
    
    const date = new Date(createdAt);

    const clickHandler = () => {
        reroute(`/dashboard/${projectId}`);
    }
    
    return (
        <div onClick={clickHandler} className={styles['project']}>
            <div className={styles['text-wrapper']}>
                <div className={styles['name-trash-wrapper']}>
                    <h3 id={styles['project-name']}>{projectName}</h3>
                </div>
                <h4 id={styles['project-creation-date']}>{date.toLocaleDateString()}</h4>
                <h4 id={styles['project-permission']}>{permission}</h4>
            </div>
        </div>

    )
}

export default Project;