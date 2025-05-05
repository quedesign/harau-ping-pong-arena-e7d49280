import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface SupportFormProps {
  onClose: () => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        emailjs.init("O_L9K4MvjR50hNlS2");
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSending(true);
        setError(null);

        try {
            const templateParams = {
                from_name: name,
                message_type: messageType,
                message: message,
                to_email: 'monteiro.barboza@gmail.com',
            };

            const result = await emailjs.send("service_q5e66qg", "template_9w7c63u", templateParams);
            console.log(result)

            setName('');
            setMessageType('suggestion');
            setMessage('');
            setIsSent(true);
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
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-gray-100">Nome</label>
                        <input type="text" id="name" className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="messageType" className="block mb-2 text-gray-100">Tipo de Mensagem</label>
                        <select id="messageType" className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100" value={messageType} onChange={(e) => setMessageType(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="Sugestão">Sugestão</option>
                            <option value="Reclamação">Reclamação</option>
                            <option value="Parceria">Parceria</option>
                            <option value="Outros">Outros</option>
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
        </div>
    );
};

export default SupportForm;