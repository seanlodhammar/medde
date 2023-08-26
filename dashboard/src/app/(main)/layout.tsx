import '@/app/globals.css';
import Header from '@/app/components/Header/Header';
import { Inter, Poppins } from 'next/font/google'
import { useUser } from '@/api-funcs/auth';
import PageLoading from '../components/PageLoading/PageLoading';

export const metadata = {
  title: 'Medde',
  description: 'Messaging made easy',
}

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <title>Medde</title>
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        </body>
    </html>
  )
}
