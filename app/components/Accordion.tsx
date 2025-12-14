'use client';

import { ReactNode, useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({ title, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle }: AccordionItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="p-4 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

