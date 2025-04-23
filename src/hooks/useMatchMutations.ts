
import { Match } from '@/types';
import { useMatchCreate } from './mutations/useMatchCreate';
import { useMatchUpdate } from './mutations/useMatchUpdate';
import { useBracketGenerate } from './mutations/useBracketGenerate';

export const useMatchMutations = (setMatches: React.Dispatch<React.SetStateAction<Match[]>>) => {
  const { createMatch } = useMatchCreate(setMatches);
  const { updateMatch } = useMatchUpdate(setMatches);
  const { generateBracket } = useBracketGenerate();

  return {
    createMatch,
    updateMatch,
    generateBracket
  };
};
