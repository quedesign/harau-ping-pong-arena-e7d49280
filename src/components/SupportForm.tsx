import { useState, useEffect, FormEvent } from 'react';
import emailjs from '@emailjs/browser';



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

    
    
    
    const handleSubmit = async (event: React.FormEvent) => {
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
            };
        } catch (err: any) {
            setError(err.message || 'Error sending message');
            console.error('Error sending message', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-lg">
            {isSent ? (
                <div className="text-green-500">Mensagem enviada!</div>
            ): (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-gray-100">Nome</label>
                        <input type="text" id="name" className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="messageType" className="block mb-2 text-gray-100">Tipo de Mensagem</label>
                        <select id="messageType" className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100" value={messageType} onChange={(e) => setMessageType(e.target.value)}>
                            <option value="suggestion">Sugestão</option>
                            <option value="complaint">Reclamação</option>
                            <option value="partnership">Parceria</option>
                            <option value="others">Outros</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-2 text-gray-100">Mensagem</label>
                        <textarea id="message" className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100" value={message} onChange={(e) => setMessage(e.target.value)} required />
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 mr-2 rounded-md bg-zinc-800 text-gray-100 hover:bg-zinc-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full p-2 rounded-md bg-primary text-gray-100"
                            disabled={isSending}
                        >
                            {isSending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            )}
        </div>);
};

export default SupportForm;
