// src/utils/authUtils.js

/**
 * Check if a user is currently authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  // Check if user data exists in localStorage
  const userData = localStorage.getItem('bookReaderUser');
  return !!userData;
};

/**
 * Get the current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('bookReaderUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Get authentication token for API requests
 * @returns {string|null} Authentication token or null if not available
 */
export const getAuthToken = () => {
  const user = getCurrentUser();
  return user?.token || null;
};

/**
 * Mock function to initiate Google OAuth flow
 * In a real application, this would redirect to Google's OAuth page
 * @returns {Promise<Object>} Promise resolving to user data from OAuth
 */
export const initiateGoogleOAuth = async () => {
  // In a real application, this would redirect to Google's OAuth endpoint
  // For this mock implementation, we'll simulate a successful login after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `google-${Date.now()}`,
        email: 'user@gmail.com',
        displayName: 'Google User',
        username: 'googleuser',
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
      });
    }, 1000);
  });
};

/**
 * Mock function to initiate GitHub OAuth flow
 * In a real application, this would redirect to GitHub's OAuth page
 * @returns {Promise<Object>} Promise resolving to user data from OAuth
 */
export const initiateGithubOAuth = async () => {
  // In a real application, this would redirect to GitHub's OAuth endpoint
  // For this mock implementation, we'll simulate a successful login after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `github-${Date.now()}`,
        email: 'user@github.com',
        displayName: 'GitHub User',
        username: 'githubuser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/default',
      });
    }, 1000);
  });
};

/**
 * Check if user has admin rights
 * @returns {boolean} True if user has admin role, false otherwise
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Add authorization headers to API requests
 * @param {Object} headers - Existing headers object
 * @returns {Object} Headers with authorization added
 */
export const addAuthHeaders = (headers = {}) => {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};