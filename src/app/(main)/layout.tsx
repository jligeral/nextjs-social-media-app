import {validateRequest} from '@/auth';
import {redirect} from 'next/navigation';
import SessionProvider from './SessionProvider';
import Navbar from './Navbar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) redirect("/login"); // Redirect to login page if user is not logged in

  return <SessionProvider value={session}>
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto max-w-7xl p-5">
        {children}
      </div>
    </div>
  </SessionProvider>
}
