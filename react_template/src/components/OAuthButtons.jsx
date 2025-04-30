// src/components/OAuthButtons.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateGoogleOAuth, initiateGithubOAuth } from '../utils/authUtils';
import { UserContext } from '../context/UserContext';

function OAuthButtons() {
  const [loading, setLoading] = useState({
    google: false,
    github: false
  });
  
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  
  // Function to get OAuth login function from context or direct import
  const getOAuthLogin = async () => {
    if (userContext && userContext.oauthLogin) {
      return userContext.oauthLogin;
    }
    
    console.error("UserContext not available yet");
    // Fallback to direct import
    try {
      const { oauthLogin } = await import('../models/user');
      return oauthLogin;
    } catch (err) {
      console.error("User model not available yet");
      return null;
    }
  }
  
  const handleGoogleLogin = async () => {
    if (loading.google) return;
    
    setLoading(prev => ({ ...prev, google: true }));
    
    try {
      // Get authentication data from Google OAuth
      const authData = await initiateGoogleOAuth();
      
      // Get the OAuth login function
      const oauthLoginFunc = await getOAuthLogin();
      
      if (oauthLoginFunc) {
        // Login with the OAuth data
        await oauthLoginFunc('google', authData);
        
        // Redirect to home page
        navigate('/');
      } else {
        console.error("OAuth login function not available");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };
  
  const handleGithubLogin = async () => {
    if (loading.github) return;
    
    setLoading(prev => ({ ...prev, github: true }));
    
    try {
      // Get authentication data from GitHub OAuth
      const authData = await initiateGithubOAuth();
      
      // Get the OAuth login function
      const oauthLoginFunc = await getOAuthLogin();
      
      if (oauthLoginFunc) {
        // Login with the OAuth data
        await oauthLoginFunc('github', authData);
        
        // Redirect to home page
        navigate('/');
      } else {
        console.error("OAuth login function not available");
      }
    } catch (error) {
      console.error("GitHub login failed:", error);
    } finally {
      setLoading(prev => ({ ...prev, github: false }));
    }
  };
  
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading.google}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 relative"
          >
            {loading.google ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <>
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                <span className="ml-2">Google</span>
              </>
            )}
          </button>
        </div>

        <div>
          <button
            onClick={handleGithubLogin}
            disabled={loading.github}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 relative"
          >
            {loading.github ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <>
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="ml-2">GitHub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OAuthButtons;