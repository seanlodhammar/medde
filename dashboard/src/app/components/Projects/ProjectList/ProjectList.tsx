import React, { useState } from 'react';
import styles from './ProjectList.module.css';
import { User } from '@/types/auth-types';
import Project, { CreateProject } from './Project/Project';
import { ProjectInterface } from '@/types/dashboard-types';
import Dropdown from '../../UI/Dropdown/Dropdown';
import { createProject } from '@/api-funcs/dashboard';

const ProjectList : React.FC<{ projects: ProjectInterface[]; reroute: (url: string) => void; setErrors: React.Dispatch<React.SetStateAction<string[]>> }> = ({ projects = [], reroute, setErrors }) => {
    
    const [showProjectDialog, setShowProjectDialog] = useState(false);

    const [projectName, setProjectName] = useState('');
    
    const showDropdown = () => {
        setShowProjectDialog(true);
    }

    const projectNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    }

    const cancelDropdown = () => {
        setShowProjectDialog(false);
        setProjectName('');
        setErrors([]);
    }

    const createNewProject = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createProject(projectName);
            if(Array.isArray(res)) {
                setErrors(res);
                return;
            }
            setErrors([]);
            reroute(`/dashboard/${res}`);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles['project-list']}>
            { showProjectDialog ? 
            <Dropdown onCancel={cancelDropdown}>
                <form onSubmit={createNewProject} title='Create Project Form' className={styles['create-project-dialog-wrapper']}>
                    <h3 id={styles['dropdown-input-text']}>Create Project</h3>
                    <label htmlFor='project-name' id={styles['project-name-label']}>Project Name</label>
                    <input type='text' name='project-name' id={styles['project-name']} value={projectName} onChange={projectNameHandler} />
                    <button type='submit' id={styles['submit-form']}>Submit</button>
                </form>
            </Dropdown> : '' }
            <CreateProject create={showDropdown} />
            { projects ? projects.map(({ project, permission }) => <Project projectId={project._id} permission={permission} projectName={project.name} key={project._id} createdAt={project.createdAt} reroute={reroute} />) : '' }
        </div>
    )
}

export default ProjectList;