import React, { useEffect } from 'react';
import styles from './Message.module.css';

const Message : React.FC<{ type?: 'success' | 'failure', children: React.ReactNode; messageIndex: number; setMessages: React.Dispatch<React.SetStateAction<string[]>>; }> = ({ type = 'failure', children, messageIndex, setMessages }) => {

    useEffect(() => {
        setTimeout(() => {
            setMessages((prevState) => {
                const arrCopy = [...prevState];
                arrCopy.splice(messageIndex, 1);
                return arrCopy;
            });
        }, 3000)
    }, [])
    
    return (
        <div className={`${styles['message']} ${styles[type]}`}>
            { type === 'failure' ? <i className={`bi bi-x-circle ${styles['icon']}`}></i> : <i className={`bi bi-check-circle ${styles['icon']}`}></i>}
            { children }
        </div>
    )
}

export default Message;