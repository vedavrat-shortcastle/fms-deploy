import React from 'react';
import { Button } from '@/components/ui/button';

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  activeTab: 'personal' | 'mailing' | 'other';
  onTabChange: (tab: 'personal' | 'mailing' | 'other') => void;
  onBack: () => void;
  onNext: () => void;
  submitLabel: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
  activeTab,
  onTabChange,
  onBack,
  onNext,
  submitLabel,
}) => (
  <div className="max-w-4xl mx-auto p-6">
    <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
    <div className="bg-white border rounded-md shadow-lg">
      <div className="flex p-4 border-b">
        <TabButton
          active={activeTab === 'personal'}
          onClick={() => onTabChange('personal')}
        >
          Personal &amp; Contact
        </TabButton>
        <TabButton
          active={activeTab === 'mailing'}
          onClick={() => onTabChange('mailing')}
        >
          Mailing Address
        </TabButton>
        <TabButton
          active={activeTab === 'other'}
          onClick={() => onTabChange('other')}
        >
          Other Information
        </TabButton>
      </div>
      <div className="p-6">{children}</div>
      <div className="flex justify-end space-x-3 p-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="destructive" onClick={onNext}>
          {submitLabel}
        </Button>
      </div>
    </div>
  </div>
);

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ active, children, onClick }) => (
  <Button
    variant={active ? 'destructive' : 'ghost'}
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}
  >
    {children}
  </Button>
);
