import React from 'react';
import defaults from './PageComponent.module.css';

const PageComponent : React.FC<{ children: React.ReactNode; title: string; direction?: 'row' | 'column' }> = ({ children, title, direction }) => {
    return (
        <section className={defaults['page']}>
            <h1 className={defaults['page-title']}>{title}</h1>
            <div className={`${defaults['page-wrapper']} ${direction ? defaults[direction] : ''}`}>
                {children}
            </div>
        </section>
    )
}

export default PageComponent;