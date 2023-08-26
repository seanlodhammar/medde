'use client'

import '@/app/globals.css';
import DashHeader from '@/app/components/DashHeader/DashHeader';
import { Inter } from 'next/font/google';
import 'bootstrap-icons/font/bootstrap-icons.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Medde',
  description: 'Messaging made easy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
          <title>Dashboard</title>
      </head>
      <body className={inter.className}>
        <DashHeader />
        {children}
      </body>
    </html>
  )
}

