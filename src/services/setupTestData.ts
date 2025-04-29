
import { registerLocalUser } from './localAuth';
import { createBasicAthleteProfile } from './localAthleteData';

export const initializeTestData = () => {
  // Verificar se já inicializamos
  if (localStorage.getItem('test_data_initialized')) {
    return;
  }
  
  try {
    // Criar usuário atleta
    const athlete = registerLocalUser(
      'Atleta Teste', 
      'atleta@teste.com', 
      'senha123', 
      'athlete'
    );
    
    // Criar perfil para o atleta
    createBasicAthleteProfile(athlete.id);
    
    // Criar usuário administrador
    registerLocalUser(
      'Admin Teste', 
      'admin@teste.com', 
      'senha123', 
      'admin'
    );
    
    // Marcar como inicializado
    localStorage.setItem('test_data_initialized', 'true');
    
    console.log('Dados de teste inicializados com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar dados de teste:', error);
  }
};
