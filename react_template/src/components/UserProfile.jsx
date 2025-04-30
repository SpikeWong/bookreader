// src/components/UserProfile.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import Header from './Header';
import Footer from './Footer';

function UserProfile() {
  const { user, updateUserProfile, loading: userLoading, bookshelf } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    language: 'en',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Initialize form data when user is loaded
  useEffect(() => {
    if (user && user.profile) {
      setProfileData({
        displayName: user.profile.displayName || user.username,
        email: user.email || '',
        language: user.profile.preferences?.language || 'en',
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');
    
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          displayName: profileData.displayName,
          preferences: {
            language: profileData.language,
          }
        });
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError('Update functionality not available');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (userLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
            <Link 
              to="/login" 
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <div className="h-1 w-20 bg-blue-600 rounded"></div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mr-6 mb-4 md:mb-0">
                <img 
                  src={user.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0D8ABC&color=fff`} 
                  alt={user.username}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{user.profile?.displayName || user.username}</h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  @{user.username}
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Member since {new Date().toLocaleDateString()} {/* In a real app, use user.createdAt */}
                </p>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`ml-auto px-4 py-2 rounded-md ${
                  isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors duration-200`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="displayName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={profileData.displayName}
                      onChange={handleChange}
                      className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md p-2 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      disabled
                      className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md p-2 bg-gray-100 ${
                        darkMode 
                          ? 'text-gray-400 border-gray-700' 
                          : 'text-gray-500 border-gray-200'
                      }`}
                    />
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Preferred Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={profileData.language}
                      onChange={handleChange}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSaving ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="border-t border-b py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Username
                    </h3>
                    <p className="mt-1">{user.username}</p>
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Display Name
                    </h3>
                    <p className="mt-1">{user.profile?.displayName || user.username}</p>
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Email
                    </h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Preferred Language
                    </h3>
                    <p className="mt-1">
                      {user.profile?.preferences?.language === 'en' && 'English'}
                      {user.profile?.preferences?.language === 'es' && 'Spanish'}
                      {user.profile?.preferences?.language === 'fr' && 'French'}
                      {user.profile?.preferences?.language === 'de' && 'German'}
                      {user.profile?.preferences?.language === 'zh' && 'Chinese'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Reading Statistics
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h4 className="text-sm font-medium text-gray-500">Books in Bookshelf</h4>
                      <p className="mt-2 text-3xl font-semibold">{bookshelf?.length || 0}</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h4 className="text-sm font-medium text-gray-500">Books Completed</h4>
                      <p className="mt-2 text-3xl font-semibold">
                        {bookshelf?.filter(b => (b.progress || 0) >= 100)?.length || 0}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h4 className="text-sm font-medium text-gray-500">Reading Streak</h4>
                      <p className="mt-2 text-3xl font-semibold">3 days</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link 
                    to="/bookshelf" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View My Bookshelf
                    <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserProfile;