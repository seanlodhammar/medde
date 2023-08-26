import React, { useState } from 'react';
import styles from './AddCollaboratorForm.module.css';
import { addCollaborator } from '@/api-funcs/dashboard';
import Messages from '@/app/components/UI/Messages/Messages';
import { useSWRConfig } from 'swr';

const AddCollaboratorForm : React.FC<{ handleCollaboratorForm: () => void; projectId: string }> = ({ handleCollaboratorForm, projectId }) => {
    const [email, setEmail] = useState<string>('');
    const [permission, setPermission] = useState<'Admin' | 'Support' | 'Developer'>('Support');
    const { mutate } = useSWRConfig();
    const [errors, setErrors] = useState<string[]>([]);

    const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const formSubmissionHandler = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await addCollaborator(projectId, email, permission);
            if(Array.isArray(res)) {
                setErrors(res);
                return;
            };
            mutate(`/project/${projectId}`)
            handleCollaboratorForm();
        } catch (e) {
            console.log(e);
        }
    }

    const permissionHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        switch(v) {
            case 'Admin':
            case 'Support':
            case 'Developer':
                setPermission(v);
                break;
        }
    }

    return (
        <div className={styles['form-wrapper']}>
            <h2>Add Collaborator</h2>
            <form className={styles['add-collaborator-form']} onSubmit={formSubmissionHandler}>
                <label id={styles['collaborator-email-label']} htmlFor='collaborator-email'>Email</label>
                <input id={styles['collaborator-email-input']} name='collaborator-email' value={email} onChange={emailHandler} placeholder='john@example.com'/>
                <label htmlFor='permission-select'>Permission:</label>
                <select className={styles['permission-select']} name='permission-select' onChange={permissionHandler} value={permission}>
                    <option className={styles['permission-select-options']}>Support</option>
                    <option className={styles['permission-select-options']}>Developer</option>
                    <option className={styles['permission-select-options']}>Admin</option>
                </select>
                <div className={styles['btn-container']}>
                    <button className={styles['form-btn']}>Submit</button>
                    <button onClick={handleCollaboratorForm} className={styles['form-btn']} id={styles['close-btn']} type='button'>Close</button>
                </div>
                
            </form>
        </div>
    )
};

export default AddCollaboratorForm;