import React from 'react';
import styles from './SidebarLink.module.css';
import Link from 'next/link';

const SidebarLink : React.FC<{ children: React.ReactNode; href: string; pathname: string; className?: string }> = ({ children, href, pathname, className }) => {
    return (
        <Link href={href} className={`${styles['sidebar-link']} ${pathname === href ? styles['selected'] : ''} ${className}`}>
            <div id={styles['text-wrapper']}>
                {children}
            </div>
        </Link>
    )
}

export default SidebarLink;