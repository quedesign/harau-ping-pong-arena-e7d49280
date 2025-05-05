
import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SupportFormProps {
  onClose: () => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [messageType, setMessageType] = useState('suggestion');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSending(true);
        setError(null);

        try {
            const templateParams = {
                from_name: name,
                message_type: messageType,
                message: message,
            };
            
            const response = await emailjs.send(
                'service_03m029g',
                'template_011z40k',
                templateParams,
                'x_QyYm3P2r302tU_h'
            );

            if (response.status === 200) {
                setName('');
                setMessageType('suggestion');
                setMessage('');
                setIsSent(true);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar mensagem');
            console.error('Erro ao enviar mensagem', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-lg shadow-xl">
            {isSent ? (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-green-500 font-medium">Mensagem enviada!</p>
                    <Button onClick={onClose} className="mt-4">
                        Fechar
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-100">Nome</Label>
                        <Input 
                            type="text" 
                            id="name" 
                            className="border-zinc-700 bg-zinc-800 text-gray-100" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="messageType" className="text-gray-100">Tipo de Mensagem</Label>
                        <Select value={messageType} onValueChange={setMessageType}>
                            <SelectTrigger className="border-zinc-700 bg-zinc-800 text-gray-100">
                                <SelectValue placeholder="Selecione o tipo de mensagem" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem value="suggestion">Sugestão</SelectItem>
                                <SelectItem value="complaint">Reclamação</SelectItem>
                                <SelectItem value="partnership">Parceria</SelectItem>
                                <SelectItem value="others">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-100">Mensagem</Label>
                        <Textarea 
                            id="message" 
                            className="border-zinc-700 bg-zinc-800 text-gray-100 min-h-[100px]" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 p-2 rounded-md bg-red-900/20">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="border-zinc-700 hover:bg-zinc-700 text-gray-100"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSending}
                            className="bg-primary text-white"
                        >
                            {isSending ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SupportForm;
