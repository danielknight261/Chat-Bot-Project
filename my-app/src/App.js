import React, { useState } from 'react';
import ChatForm from './components/ChatForm';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`App min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}
    >
      <div className="container mx-auto py-4 flex-grow">
        <ChatForm />
      </div>
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

export default App;
