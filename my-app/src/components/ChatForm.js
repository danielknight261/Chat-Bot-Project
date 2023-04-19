import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const ChatForm = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const typeAssistantResponse = async (assistantResponse) => {
    setIsAssistantTyping(true);
    let typedResponse = '';
    for (const char of assistantResponse) {
      typedResponse += char;
      await new Promise((resolve) => setTimeout(resolve, 50));
      setResponses((prevResponses) => [
        ...prevResponses.slice(0, -1),
        { type: 'assistant', text: typedResponse },
      ]);
    }
    setIsAssistantTyping(false);
  };

  const getAssistantResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: `User: ${userMessage}\nAssistant:`,
          max_tokens: 200,
          n: 1,
          stop: ["\n"],
          temperature: 0.6,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error connecting to OpenAI API:', error);
      return 'An error occurred while connecting to the API.';
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [responses]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setResponses((prevResponses) => [...prevResponses, { type: 'user', text: message }]);
    setMessage('');

    const assistantResponse = await getAssistantResponse(message);
    setResponses((prevResponses) => [
      ...prevResponses,
      { type: 'assistant', text: '' },
    ]);
    await typeAssistantResponse(assistantResponse);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-4 overflow-auto">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded ${
              response.type === 'user' ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 border border-gray-300'
            }`}
          >
            {response.text}
          </div>
        ))}
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-auto mb-4 w-2/5 mx-auto">
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
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatForm;