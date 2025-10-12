import '../app/globals.css';
import React from 'react';

export const metadata = {
  title: 'EduShare',
  description: 'Collaborative education platform for teachers and students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}