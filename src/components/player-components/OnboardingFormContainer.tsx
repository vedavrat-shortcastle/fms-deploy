'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface OnboardingFormContainerProps {
  title: string;
  children: React.ReactNode;
  activeTab: 'stepOne' | 'stepTwo';
  onTabChange: (tab: 'stepOne' | 'stepTwo') => void;
  onBack: () => void;
  onNext: () => void;
  submitLabel: string;
}

export const OnboardingFormContainer: React.FC<
  OnboardingFormContainerProps
> = ({
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
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as 'stepOne' | 'stepTwo')}
      >
        <TabsList className="flex p-6 border-b">
          <TabsTrigger
            value="stepOne"
            className="flex-1 text-lg font-semibold px-4 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700"
          >
            Step One
          </TabsTrigger>
          <TabsTrigger
            value="stepTwo"
            className="flex-1 text-lg font-semibold px-4 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-700"
          >
            Step Two
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="p-6">
          {children}
        </TabsContent>
      </Tabs>
      <div className="flex justify-end space-x-3 p-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={activeTab === 'stepOne'}
        >
          Back
        </Button>
        <Button variant="destructive" onClick={onNext}>
          {submitLabel}
        </Button>
      </div>
    </div>
  </div>
);
