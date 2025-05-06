
import { Trophy } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
      <Trophy className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
      <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
      <p className="text-zinc-400 mb-6">{message}</p>
    </div>
  );
};
