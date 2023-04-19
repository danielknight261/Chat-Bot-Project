// Import necessary dependencies
import React, { useState } from 'react';
// Import the ChatForm component
import ChatForm from './components/ChatForm';

// Define the App functional component
function App() {
  // Declare a state variable for dark mode using the useState hook
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode on and off
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render the App component
  return (
    <div
      className={`App min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}
    >
      <div className="container mx-auto py-4 flex-grow">
        {/* Render the ChatForm component */}
        <ChatForm />
      </div>
      {/* Render the dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <span className={`transform ${darkMode ? '-rotate-180' : ''} transition duration-300`}>
          {darkMode ? '🌞' : '🌙'}
        </span>
      </button>
    </div>
  );
}

// Export the App component as the default export
export default App;
