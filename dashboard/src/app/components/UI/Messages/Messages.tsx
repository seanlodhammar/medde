import React, { useEffect } from 'react';
import styles from './Messages.module.css';
import Message from './Message/Message';

const Messages : React.FC<{ messages: string[]; setMessages: React.Dispatch<React.SetStateAction<string[]>> }> = ({ messages, setMessages }) => {

    return (
        <div className={styles['wrapper']}>
            { messages.map((message, index) => <Message key={Math.random()} type='failure' messageIndex={index} setMessages={setMessages}>{message}</Message>) }
        </div>
    )
}

export default Messages;