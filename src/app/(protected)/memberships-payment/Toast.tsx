// src/components/ui/Toast.tsx
import React from 'react';

export type ToastProps = {
  message: string;
  type: 'success' | 'error';
};

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 px-20 py-4 rounded shadow-md text-white text-2xl ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
