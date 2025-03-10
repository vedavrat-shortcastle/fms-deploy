import React from 'react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title }) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-4 border-b">
      <div className="bg-red-500 rounded-full p-1.5">{icon}</div>
      <h1 className="text-lg font-medium">{title}</h1>
    </div>
  );
};
