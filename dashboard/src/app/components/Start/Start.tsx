import { Poppins } from "next/font/google";
import styles from './Start.module.css';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

const Start = () => {

    return (
        <section className={styles['start']}>
            <h2 className={`${styles['heading']}`}>Messaging made easy.</h2>
            <h4 className={`${styles['incentive']} ${poppins.className}`}>Connect your customers to support services, bots and much more. It's up to you.</h4>
            <button className={`${styles['info-btn']}`}>Learn More</button>
        </section>
    )
}

export default Start;