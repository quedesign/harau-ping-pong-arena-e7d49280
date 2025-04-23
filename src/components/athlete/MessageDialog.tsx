
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner"; // Using the sonner toasts for notifications
import { Calendar, Send } from "lucide-react";

interface MessageDialogProps {
  athleteName: string;
  onSchedule?: () => void;
  trigger?: React.ReactNode;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ athleteName, onSchedule, trigger }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Message sent to ${athleteName}`);
      setMessage("");
      // Automatically close dialog after sending
      document.getElementById("close-message-dialog")?.click();
    }, 700);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Message {athleteName}</DialogTitle>
          <DialogDescription>
            Send a direct message or ask to schedule a match.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={message}
          placeholder={`Write a message to ${athleteName}...`}
          onChange={e => setMessage(e.target.value)}
          className="mb-2"
          disabled={isSending}
        />
        <DialogFooter className="flex-col sm:flex-row sm:justify-end mt-3 gap-2">
          {onSchedule && (
            <Button
              onClick={onSchedule}
              variant="outline"
              type="button"
              size="sm"
              className="w-full sm:w-auto"
            >
              <Calendar size={16} className="mr-1" /> Schedule Match
            </Button>
          )}
          <Button
            onClick={handleSend}
            type="button"
            disabled={isSending}
            className="w-full sm:w-auto"
          >
            <Send size={16} className="mr-1" /> Send
          </Button>
          <DialogClose asChild>
            <button id="close-message-dialog" className="hidden" tabIndex={-1} />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;

