import React from 'react';
import styles from './Collaborator.module.css';

const Collaborator : React.FC<{ email: string; date: string; permission: 'Admin' | 'Support' | 'Developer'; status: 'Member' | 'Pending'; _id: string; remove: (id: string) => void; }> = ({ _id, email, date, permission, status, remove }) => {

    const removeHandler = () => {
        remove(_id);
    }

    return (
        <div className={styles['collaborator']}>
            <h5 className={styles['collaborator-text']} id={styles['collaborator-email']}>{email}</h5>
            <h5 className={styles['collaborator-text']} id={styles['collaborator-date']}>{date}</h5>
            <h5 className={styles['collaborator-text']} id={styles['collaborator-permissions']}>{permission}</h5>
            <h5 className={styles['collaborator-text']} id={styles['collaborator-status']}>{status}</h5>
            <div className={styles['collaborator-actions']}>
                <button className={`${styles['collaborator-action']} ${styles['collaborator-remove']}`} onClick={removeHandler}><i className="bi bi-trash3"></i></button>
            </div>

        </div>
    )
}

export default Collaborator;