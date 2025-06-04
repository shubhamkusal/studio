// components/LoginForm.js (or wherever your login logic is)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get dashboard URL from environment
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard';

  const redirectToDashboard = () => {
    console.log('Redirecting to dashboard:', dashboardUrl);
    
    // If it's a full URL (different domain)
    if (dashboardUrl.startsWith('http')) {
      window.location.href = dashboardUrl;
    } else {
      // If it's a relative path (same domain)
      router.push(dashboardUrl);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);
      
      // Show success message (optional)
      // toast.success('Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard
      redirectToDashboard();
      
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show toast, etc.)
      // toast.error('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login successful:', result.user.email);
      
      // Show success message (optional)
      // toast.success('Login successful! Redirecting to dashboard...');
      
      // Redirect to dashboard
      redirectToDashboard();
      
    } catch (error) {
      console.error('Google login error:', error);
      // Handle error (show toast, etc.)
      // toast.error('Google login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', result.user.email);
      
      // Show success message (optional)
      // toast.success('Account created! Redirecting to dashboard...');
      
      // Redirect to dashboard
      redirectToDashboard();
      
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle error (show toast, etc.)
      // toast.error('Sign up failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailPasswordLogin}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <button type="button" onClick={handleSignUp} disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <button type="button" onClick={handleGoogleLogin} disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In with Google'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
