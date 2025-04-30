import React, { useState, useEffect } from 'react';
import { configureApiKey, getApiKey } from '../config/apiConfig';

function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Load existing API key if available
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setIsError(true);
      return;
    }

    // Save the API key to localStorage
    configureApiKey(apiKey.trim());
    setIsSaved(true);
    setIsError(false);
    
    // Hide saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        Google Translate API Configuration
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="apiKey" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Google Translate API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setIsError(false);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="Enter your API key"
          />
          {isError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              API key is required
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save API Key
          </button>
          
          {isSaved && (
            <span className="text-sm text-green-600 dark:text-green-400 ml-3">
              API key saved successfully!
            </span>
          )}
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Note: Your API key is stored locally in your browser and is not sent to our servers.</p>
        <p className="mt-1">
          You can get a Google Translate API key from the{' '}
          <a 
            href="https://cloud.google.com/translate/docs/setup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google Cloud Console
          </a>.
        </p>
      </div>
    </div>
  );
}

export default ApiKeyInput;