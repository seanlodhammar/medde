import Image from 'next/image'
import styles from './page.module.css'
import Start from '@/app/components/Start/Start';
import Convenience from '@/app/components/Convenience/Convenience';

export const Index : React.FC = () => {

  return (
    <main>
      <Start />
      <Convenience />
    </main>
  )
};

export default Index;