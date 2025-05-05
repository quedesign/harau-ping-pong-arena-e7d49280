
import { useState } from 'react';

interface SupportFormProps {
  onClose: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionSuccess(true);
      setName('');
      setMessageType('');
      setMessage('');
    } catch (error: any) {
      setSubmissionError(error.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg w-96 border border-zinc-800 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Contato</h2>
      {submissionSuccess ? (
        <div>
          <div className="text-green-500 mb-4">Mensagem enviada com sucesso!</div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 w-full"
          >
            Fechar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2" htmlFor="name">
              Nome:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 text-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2" htmlFor="messageType">
              Tipo de Mensagem:
            </label>
            <select
              id="messageType"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full bg-zinc-800 text-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecione</option>
              <option value="suggestion">Sugestão</option>
              <option value="complaint">Reclamação</option>
              <option value="partnership">Parceria</option>
              <option value="others">Outros</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2" htmlFor="message">
              Mensagem:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-zinc-800 text-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              required
            />
          </div>
          {submissionError && <div className="text-red-500 mb-4">{submissionError}</div>}
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
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SupportForm;
