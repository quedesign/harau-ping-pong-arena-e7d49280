import { useState } from 'react';
import { SupportForm } from './SupportForm';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const FloatingSupportButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4">
          <SupportForm onClose={handleClose} />
        </div>
      )}
      <Button
        onClick={handleOpen}
        className="rounded-full w-14 h-14 flex items-center justify-center bg-primary"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};