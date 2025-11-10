import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  centered = true 
}) => {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h1 className="text-gray-900 dark:text-gray-100 mb-1">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
};