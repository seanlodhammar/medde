import React from 'react';
import styles from './ContentText.module.css';

const ContentText : React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return <h4 className={`${styles['content-text']} ${className}`}>{children}</h4>
}

export default ContentText;