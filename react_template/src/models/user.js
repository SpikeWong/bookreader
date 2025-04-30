// src/models/user.js
// Mock user data store
const users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123', // In a real app, passwords would be hashed
    profile: {
      displayName: 'Demo User',
      avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
      preferences: {
        language: 'en',
        darkMode: false
      }
    }
  }
];

// Helper to persist users to localStorage
const persistUsers = () => {
  localStorage.setItem('bookReaderUsers', JSON.stringify(users));
};

// Helper to load users from localStorage
const loadUsers = () => {
  const savedUsers = localStorage.getItem('bookReaderUsers');
  if (savedUsers) {
    users.length = 0; // Clear the array
    users.push(...JSON.parse(savedUsers));
  }
};

// Initialize by loading saved users
loadUsers();

// Get current user from localStorage
export const getUser = async () => {
  try {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      return JSON.parse(currentUserJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Register new user
export const registerUser = async (userData) => {
  // Check if username or email already exists
  const existingUser = users.find(
    user => user.username === userData.username || user.email === userData.email
  );

  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    password: userData.password, // In a real app, this would be hashed
    profile: {
      displayName: userData.displayName || userData.username,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=0D8ABC&color=fff`,
      preferences: {
        language: 'en',
        darkMode: false
      }
    }
  };

  // Add to users array
  users.push(newUser);
  persistUsers();

  // Store current user
  const userForSession = { ...newUser };
  delete userForSession.password;
  localStorage.setItem('currentUser', JSON.stringify(userForSession));

  return userForSession;
};

// Login user
export const loginUser = async (username, password) => {
  // Find user by username or email
  const user = users.find(
    user => (user.username === username || user.email === username) && user.password === password
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Create user object for session (without password)
  const userForSession = { ...user };
  delete userForSession.password;

  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(userForSession));

  return userForSession;
};

// OAuth login - This would integrate with real OAuth providers in a production app
export const oauthLogin = async (provider, authData) => {
  // In a real app, this would validate the authData with the OAuth provider

  // For demo purposes, create or find a mock user
  let user;
  let email;
  let username;
  let displayName;
  
  if (provider === 'google') {
    email = authData.email || 'google_user@example.com';
    username = `google_${Date.now()}`;
    displayName = authData.displayName || 'Google User';
  } else if (provider === 'github') {
    email = authData.email || 'github_user@example.com';
    username = `github_${Date.now()}`;
    displayName = authData.displayName || 'GitHub User';
  } else {
    throw new Error('Unsupported OAuth provider');
  }

  // Check if user already exists
  user = users.find(u => u.email === email);
  
  if (!user) {
    // Create new user
    user = {
      id: Date.now().toString(),
      username,
      email,
      password: null, // OAuth users don't have passwords
      profile: {
        displayName,
        avatarUrl: authData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`,
        preferences: {
          language: 'en',
          darkMode: false
        }
      }
    };
    
    users.push(user);
    persistUsers();
  }

  // Create user object for session (without password)
  const userForSession = { ...user };
  delete userForSession.password;

  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(userForSession));

  return userForSession;
};

// Logout user
export const logoutUser = async () => {
  localStorage.removeItem('currentUser');
  return true;
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  // Find user by ID
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user profile
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...profileData
  };
  
  persistUsers();
  
  // Update current user in localStorage if it's this user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (currentUser.id === userId) {
    currentUser.profile = users[userIndex].profile;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  
  const userForSession = { ...users[userIndex] };
  delete userForSession.password;
  
  return userForSession;
};