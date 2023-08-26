import React, { useState } from 'react';
import styles from './CollaboratorList.module.css';
import Collaborator from './Collaborator/Collaborator';
import { SingularProject } from '@/types/dashboard-types';
import Dropdown from '@/app/components/UI/Dropdown/Dropdown';

const CollaboratorList : React.FC<{ projectData: SingularProject }> = ({ projectData }) => {

    if(!projectData || !Array.isArray(projectData.collaborators)) return;

    const [userIdToBeRemoved, setUserIdToBeRemoved] = useState<string>('');
    const [dropdownNeeded, setDropdownNeeded] = useState<boolean>(false);

    const removeCollaborator = () => {
        if(!userIdToBeRemoved || userIdToBeRemoved.length < 1) {
            return;
        }
        setDropdownNeeded(false);
        console.log(userIdToBeRemoved)
    }

    const handleCollaboratorId = (id: string) => {
        setUserIdToBeRemoved(id);
        setDropdownNeeded(true);
    }

    const handleDropdown = () => {
        setUserIdToBeRemoved('');
    }

    return (
        <div className={styles['collaborator-list']}>
            { projectData.collaborators.length < 1 ? <h2>No collaborators added</h2> :         
            <React.Fragment>
                { userIdToBeRemoved.length > 0 && dropdownNeeded ? <Dropdown sensitiveFormTitle='Remove Collaborator' onCancel={handleDropdown} type='sensitive' projectData={projectData} onFormCompletion={removeCollaborator} /> : ''}
                <div className={styles['titles']}>
                    <h4 className={styles['collaborator-title']} id={styles['email-title']}>Email</h4>
                    <h4 className={styles['collaborator-title']} id={styles['date-title']}>Date added</h4>
                    <h4 className={styles['collaborator-title']} id={styles['permissions-title']}>Permissions</h4>
                    <h4 className={styles['collaborator-title']} id={styles['status-title']}>Status</h4>
                    <h4 className={styles['collaborator-title']} id={styles['actions-title']}>Actions</h4>
                </div>
                { projectData.collaborators.map((collaborator) => <Collaborator email={collaborator.email} _id={collaborator._id} remove={handleCollaboratorId} date={collaborator.dateAdded} permission={collaborator.permission} key={collaborator._id} status={collaborator.status} />) }
            </React.Fragment>    
            }

        </div> 
    )
}

export default CollaboratorList;