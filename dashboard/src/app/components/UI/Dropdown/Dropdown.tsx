'use client';

import React, { useEffect, useState } from 'react';
import styles from './Dropdown.module.css';
import { useProject } from '@/api-funcs/dashboard';

const Dropdown : React.FC<{ children?: React.ReactNode; onCancel: () => void; type?: 'sensitive'; projectData?: any; onFormCompletion?: () => void; sensitiveFormTitle?: string; }> = ({ children, onCancel, type, projectData, onFormCompletion, sensitiveFormTitle }) => {

    if(type === 'sensitive') {

        const [projectName, setProjectName] = useState('');
        const [formCompleted, setFormCompleted] = useState(false);

        const projectNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
            setProjectName(e.target.value);
        } 

        const nameConditionFulfilled = projectName === projectData.name;

        const submissionHandler = async(e?: React.FormEvent) => {
            if(e) {
                e.preventDefault();
            }
            if(!nameConditionFulfilled) {
                return;
            }
            setFormCompleted(true);
            if(!onFormCompletion) {
                return;
            }
            onFormCompletion();
        }

        useEffect(() => {
            if(!children && formCompleted) {
                submissionHandler();
            }
        }, [formCompleted])

        if(formCompleted && !children) return;

        return (
            <>
            <div className={styles['wrapper']}>
                <div className={styles['backdrop']} onClick={onCancel}/>
                <div className={`${styles['dropdown']}`}>
                    { !formCompleted ?
                        <form className={styles['project-sensitive-form']} title='Access Sensitive Information' onSubmit={submissionHandler}>
                            <h2>{sensitiveFormTitle ? sensitiveFormTitle : 'Sensitive Information'}</h2>
                            <label htmlFor='project-name-input' id={styles['project-name-label']}>Type <mark id={styles['project-label-mark']}>{projectData.name}</mark> to continue</label>
                            <input value={projectName} onChange={projectNameHandler} id={styles['project-name-input']} name='project-name-input' placeholder={projectData.name} />
                            <div className={styles['button-wrapper']}>
                                <button className={`${styles['sensitive-form-btn']} ${ !nameConditionFulfilled ? styles['condition-not-met'] : ''}`} id={styles['sensitive-form-submit-btn']} type='submit'>Submit</button>
                                <button className={styles['sensitive-form-btn']} id={styles['sensitive-form-cancel-btn']} onClick={onCancel} type='button'>Cancel</button>
                            </div>
                        </form>  : 
                        ''
                    }
                    {formCompleted && children ? children : ''}

                </div>
            </div>
            </>  
        )
    }
    
    return (
        <>
        <div className={styles['wrapper']}>
            <div className={styles['backdrop']} onClick={onCancel}/>
            <div className={`${styles['dropdown']}`}>
                { children }
            </div>
        </div>
        </>

    )
}

export default Dropdown;