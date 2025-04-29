
import { AthleteProfile, PlayingStyle, GripStyle, PlayFrequency, TournamentParticipation } from '@/types';

const ATHLETES_KEY = 'local_athletes';

// Inicializa o armazenamento local se não existir
const initLocalAthletes = () => {
  if (!localStorage.getItem(ATHLETES_KEY)) {
    localStorage.setItem(ATHLETES_KEY, JSON.stringify([]));
  }
};

// Obter todos os perfis de atletas
export const getAllAthleteProfiles = (): AthleteProfile[] => {
  initLocalAthletes();
  return JSON.parse(localStorage.getItem(ATHLETES_KEY) || '[]');
};

// Obter um perfil específico de atleta por ID
export const getAthleteProfile = (userId: string): AthleteProfile | undefined => {
  const athletes = getAllAthleteProfiles();
  return athletes.find(athlete => athlete.userId === userId);
};

// Criar um novo perfil de atleta
export const createAthleteProfile = (profile: AthleteProfile): AthleteProfile => {
  const athletes = getAllAthleteProfiles();
  
  // Verificar se já existe um perfil para este usuário
  const existingIndex = athletes.findIndex(a => a.userId === profile.userId);
  
  if (existingIndex >= 0) {
    // Atualizar perfil existente
    athletes[existingIndex] = profile;
  } else {
    // Adicionar novo perfil
    athletes.push(profile);
  }
  
  localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
  return profile;
};

// Atualizar um perfil de atleta existente
export const updateAthleteProfile = (userId: string, data: Partial<AthleteProfile>): AthleteProfile => {
  const athletes = getAllAthleteProfiles();
  const index = athletes.findIndex(a => a.userId === userId);
  
  if (index === -1) {
    throw new Error('Perfil de atleta não encontrado');
  }
  
  // Mesclar dados
  athletes[index] = {
    ...athletes[index],
    ...data,
    location: {
      ...athletes[index].location,
      ...(data.location || {})
    },
    equipment: {
      ...athletes[index].equipment,
      ...(data.equipment || {})
    }
  };
  
  localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
  return athletes[index];
};

// Criar um perfil de atleta básico para novos usuários
export const createBasicAthleteProfile = (userId: string): AthleteProfile => {
  const basicProfile: AthleteProfile = {
    userId,
    handedness: 'right',
    level: 'beginner',
    location: {
      city: '',
      state: '',
      country: ''
    },
    wins: 0,
    losses: 0,
    availableTimes: [],
    preferredLocations: [],
    equipment: {}
  };
  
  return createAthleteProfile(basicProfile);
};
