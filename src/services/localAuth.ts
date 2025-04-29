
import { User, UserRole } from '@/types';

// Tipos para autenticação local
export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // Apenas para demonstração, em produção nunca armazene senhas em texto simples
  role: UserRole;
  profileImage?: string | null;
  createdAt: string;
}

export interface LocalSession {
  user: LocalUser;
  expiresAt: number; // timestamp de expiração da sessão
}

// Chaves para localStorage
const USERS_KEY = 'local_users';
const SESSION_KEY = 'local_session';

// Funções auxiliares
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const getCurrentTimestamp = () => new Date().getTime();
const getExpirationTimestamp = () => getCurrentTimestamp() + (7 * 24 * 60 * 60 * 1000); // 7 dias

// Inicializar o banco de dados local se não existir
const initLocalDb = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
};

// Funções de autenticação
export const getLocalUsers = (): LocalUser[] => {
  initLocalDb();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const getLocalSession = (): LocalSession | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;

  const session = JSON.parse(sessionData) as LocalSession;
  
  // Verificar se a sessão expirou
  if (session.expiresAt < getCurrentTimestamp()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  
  return session;
};

export const getCurrentUser = (): User | null => {
  const session = getLocalSession();
  if (!session) return null;
  
  const { user } = session;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage || null,
    createdAt: new Date(user.createdAt)
  };
};

export const registerLocalUser = (name: string, email: string, password: string, role: UserRole): LocalUser => {
  initLocalDb();
  const users = getLocalUsers();
  
  // Verificar se o email já existe
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Este email já está registrado');
  }
  
  const newUser: LocalUser = {
    id: generateId(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return newUser;
};

export const loginLocalUser = (email: string, password: string, role?: UserRole): LocalUser => {
  const users = getLocalUsers();
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }
  
  // Se o papel foi especificado, verificar se o usuário tem esse papel
  if (role && user.role !== role) {
    throw new Error(`Você não tem acesso como ${role === 'admin' ? 'administrador' : 'atleta'}`);
  }
  
  // Criar sessão
  const session: LocalSession = {
    user,
    expiresAt: getExpirationTimestamp()
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return user;
};

export const logoutLocalUser = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const resetLocalPassword = (email: string): boolean => {
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex === -1) {
    throw new Error('Email não encontrado');
  }
  
  // Em uma aplicação real, enviaríamos um email com um link para redefinição
  // Aqui apenas simulamos uma redefinição bem-sucedida
  return true;
};

export const updateLocalUserProfile = (userId: string, data: {name?: string; email?: string}): User => {
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  if (data.email) {
    const emailExists = users.some((u, idx) => idx !== userIndex && u.email.toLowerCase() === data.email?.toLowerCase());
    if (emailExists) {
      throw new Error('Este email já está em uso');
    }
    users[userIndex].email = data.email;
  }
  
  if (data.name) {
    users[userIndex].name = data.name;
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Atualizar sessão se for o usuário atual
  const session = getLocalSession();
  if (session && session.user.id === userId) {
    session.user = users[userIndex];
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  
  return {
    id: users[userIndex].id,
    name: users[userIndex].name,
    email: users[userIndex].email,
    role: users[userIndex].role,
    profileImage: users[userIndex].profileImage || null,
    createdAt: new Date(users[userIndex].createdAt)
  };
};

export const changeLocalUserPassword = (userId: string, currentPassword: string, newPassword: string): boolean => {
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  if (users[userIndex].password !== currentPassword) {
    throw new Error('Senha atual incorreta');
  }
  
  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return true;
};
