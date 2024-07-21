'use client';

import Navbar from '@/components/navbar';
import useAuth from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';

export default function DashboardPage() {
  // useEffect hook implem to check token exp (one line for every page)
  useAuth();

  const { user, loading, error } = useUser();

  if (loading) {
    // if api req takes long time, indicate to user
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1>Whoops! Error loading your data :/</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1>Welcome to the DASHBOARD Page, {user.firstname} !</h1>
    </div>
  );
}
