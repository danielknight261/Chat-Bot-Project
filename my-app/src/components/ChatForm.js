import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const ChatForm = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setResponses((prevResponses) => [...prevResponses, { type: 'user', text: message }]);
    setMessage('');

    try {
      console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: `User: ${message}\nAssistant:`,
          max_tokens: 100,
          num: 1,
          stop: null,
          temperature: 0.8,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const assistantResponse = response.data.choices[0].text.trim();
      setResponses((prevResponses) => [
        ...prevResponses,
        { type: 'assistant', text: assistantResponse },
      ]);
    } catch (error) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);

        if (error.response.status === 429) {
          setResponses((prevResponses) => [
            ...prevResponses,
            { type: 'assistant', text: 'The API rate limit has been reached. Please wait and try again later.' },
          ]);
        }
      } else {
        console.error('Error connecting to OpenAI API:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
              Your message:
            </label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send
          </button>
        </form>
      </div>
      <div className="mt-4">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded ${response.type === 'user' ? 'bg-blue-200' : 'bg-gray-300'
              }`}
          >
            {response.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatForm;
