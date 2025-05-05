
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface SideSliderProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const SideSlider: React.FC<SideSliderProps> = ({ title, children, isOpen, onClose }) => {

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden",
        isOpen ? "" : "pointer-events-none",
      )}
    >
      <div className="fixed inset-0 transition-opacity">
        <div
          className={cn(
            "absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
      </div>
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={cn(
            "w-screen max-w-md bg-zinc-900 shadow-xl transition-all",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-medium leading-6 text-gray-100">{title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeft className="h-6 w-6"/>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
