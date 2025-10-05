import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/contactus/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Illustration */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          Oops! Page not found
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link to="/">
          <Button>
            Go Back Home
          </Button>
        </Link>

      </div>
    </div>
  );
};

export default NotFoundPage;