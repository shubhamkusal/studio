// components/SignOutButton.js
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Optionally redirect to landing page
      // router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
