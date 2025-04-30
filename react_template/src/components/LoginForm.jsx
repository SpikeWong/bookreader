// src/components/LoginForm.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import OAuthButtons from './OAuthButtons';
import { loginUser } from '../models/user';
import Header from './Header';

function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);
  const { user, login, register } = useContext(UserContext);
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateSignupForm = () => {
    // Check if all fields are filled
    if (!signupData.username || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    // Check if passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check password strength
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (login) {
        // Attempt to login
        const userData = await loginUser(
          loginData.username,
          loginData.password
        );
        
        // Update context with user data
        await login(userData);
        
        // Redirect to intended destination
        navigate(from, { replace: true });
      } else {
        setError('Login service not available');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (register) {
        // Attempt to register
        await register({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password
        });
        
        // Redirect to home page after successful registration
        navigate('/');
      } else {
        setError('Registration service not available');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isSignup ? 'Create your account' : 'Sign in to your account'}
            </h2>
          </div>
          
          <OAuthButtons />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                Or continue with
              </span>
            </div>
          </div>
          
          {!isSignup ? (
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="login-username" className="sr-only">Username or Email</label>
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Username or email"
                    value={loginData.username}
                    onChange={handleLoginChange}
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="sr-only">Password</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 rounded ${
                      darkMode
                        ? 'bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      </span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Sign in
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>New to our platform?</span>{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignup(true); setError(''); }}
                    className={`font-medium text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="signup-username" className="sr-only">Username</label>
                  <input
                    id="signup-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="sr-only">Email address</label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Email address"
                    value={signupData.email}
                    onChange={handleSignupChange}
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="sr-only">Password</label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                </div>
                <div>
                  <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Confirm password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className={`h-4 w-4 rounded ${
                      darkMode
                        ? 'bg-gray-800 border-gray-600 text-blue-600 focus:ring-blue-500'
                        : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      </span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Sign up
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Already have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignup(false); setError(''); }}
                    className={`font-medium text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginForm;