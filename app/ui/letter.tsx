import React, { useState, useEffect } from "react";

interface LetterProps {
  recipient: string;
  initialTitle: string;
  initialBody: string;
}

export default function Letter({
  recipient,
  initialTitle,
  initialBody,
}: LetterProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${encodeURIComponent(
      recipient
    )}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-gray-50 w-full h-content">
      <h2 className="text-2xl font-bold mb-4 w-full text-center">Your Letter</h2>
  
      <label className="text-xs text-gray-500 mb-1 w-full">Subject</label>
      <input
        className="mb-4 p-2 border rounded-lg text-sm w-full"
        placeholder={isLoading ? "Title loading..." : "Enter the title..."}
        value={title}
        onChange={handleTitleChange}
        disabled={isLoading}
      />
  
      <label className="text-xs text-gray-500 mb-1 w-full">Body</label>
      <textarea
        className="flex-grow p-4 border rounded-lg text-sm resize-vertical min-h-[60vh] w-full overflow-auto"
        placeholder={isLoading ? "Body loading..." : "Start your letter..."}
        value={body}
        onChange={handleBodyChange}
        disabled={isLoading}
      />
  
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg w-full"
        onClick={handleSendEmail}
        disabled={isLoading}
      >
        Send Email
      </button>
    </div>
  );  
}
