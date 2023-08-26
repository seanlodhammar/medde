import React from 'react';
import styles from './Projects.module.css';
import ProjectList from './ProjectList/ProjectList';
import { ProjectInterface } from '@/types/dashboard-types';

const Projects : React.FC<{ projects: ProjectInterface[]; reroute: (url: string) => void; setErrors: React.Dispatch<React.SetStateAction<string[]>> }> = ({ projects, reroute, setErrors }) => {
    
    if(!projects) {
        return;
    }

    return (
        <div className={styles['projects']}>
            <h2 id={styles['your-projects']}>Your Projects</h2>
            <ProjectList projects={projects} reroute={reroute} setErrors={setErrors} />
        </div>
    )
}

export default Projects;