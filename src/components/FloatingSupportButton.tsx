import { useState } from 'react';
import { SupportForm } from "./SupportForm";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const FloatingSupportButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
    
    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button variant="outline" size="icon" className="shadow-lg" onClick={toggleForm}>
                <MessageCircle className="h-6 w-6" />
            </Button>
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-96">
                    <SupportForm onClose={toggleForm} />
                </div>
            )}
        </div>
    );
};