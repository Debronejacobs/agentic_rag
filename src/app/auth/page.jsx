"use client";
import { useEffect, useState } from 'react'; // Added useState
import { useRouter } from 'next/navigation';
import { pb } from '../../../lib/pocketbase'; // Assuming this is your PocketBase instance

export default function AuthPage() {
  const router = useRouter();
  // State to prevent rendering the login form while checking initial auth status
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 1. Check initial auth status on component mount
  useEffect(() => {
    if (pb.authStore.isValid) {
      // If already valid, redirect immediately
      router.push('/dashboard');
    } else {
      // If not valid, allow the login form to be rendered
      setIsCheckingAuth(false);
    }
  }, [router]); // router is a dependency

  // 2. Redirect on subsequent auth changes (e.g., after successful login)
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (token && record) { // Check for both token and record to confirm valid auth
        
        router.push('/dashboard');
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]); // router is a dependency

  const handleGoogleSignIn = async () => {
    try {
      // The authStore.onChange listener will handle the redirect after successful auth
      await pb.collection('users').authWithOAuth2({ provider: 'google' });
     
    } catch (err) {
      console.error('OAuth2 error:', err);
      
      setIsCheckingAuth(false); // Ensure form is visible if OAuth fails before redirect
    }
  };


  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen bg-gray-950 justify-center items-center">
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-gray-950">
     
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <div className="mb-8 flex items-center">
            <div className="bg-blue-500 rounded-full p-2 mr-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-400">ClauseFinder</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-100">Discover and analyze contract clauses with ease</h2>
          <p className="text-lg text-gray-300 mb-6">
            Our AI-powered platform helps legal professionals find, compare, and understand contract 
            clauses faster than ever. Save time and reduce risk with intelligent clause analysis.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1 text-gray-100">Fast Analysis</h3>
              <p className="text-sm text-gray-400">Analyze documents in seconds</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <div className="text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1 text-gray-100">AI Accuracy</h3>
              <p className="text-sm text-gray-400">Powered by advanced ML models</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel with sign in form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile logo - visible only on small screens */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-400">ClauseFinder</h1>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-100">Welcome back</h2>
            <p className="text-gray-400 mb-8">Sign in to access your account</p>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 transition mb-6 text-gray-200"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                {/* SVG paths for Google icon */}
                 <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in or sign up with Google
            </button>
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
                      <p>© {new Date().getFullYear()} ClauseFinder. All rights reserved.</p>
                    </div>
        </div>
      </div>
    </div>
  );
}