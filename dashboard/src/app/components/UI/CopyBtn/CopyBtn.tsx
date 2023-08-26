import React, { useState } from 'react';
import styles from './CopyBtn.module.css';

const CopyBtn : React.FC<{ copyData: string }> = ({ copyData }) => {

    const [text, setText] = useState<string>('Copy');

    const copyText = () => {
        navigator.clipboard.writeText(copyData);
        setText('Copied!');
        setTimeout(() => {
            setText('Copy');
        }, 2000)
    }

    return (
        <button className={styles['copy-btn']} onClick={copyText}>{text}</button>
    )
}

export default CopyBtn;