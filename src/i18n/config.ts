
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Create a simple translation object instead of importing the JSON
const ptTranslations = {
  common: {
    login: "Entrar",
    register: "Cadastrar",
    logout: "Sair",
    dashboard: "Painel",
    profile: "Perfil",
    tournaments: "Torneios",
    athletes: "Atletas",
    messages: "Mensagens",
    settings: "Configurações",
    loading: "Carregando...",
    success: "Sucesso",
    error: "Erro",
    findAthletes: "Encontrar Atletas"
  },
  auth: {
    email: "E-mail",
    password: "Senha",
    name: "Nome",
    loginButton: "Entrar",
    registerButton: "Cadastrar",
    forgotPassword: "Esqueceu sua senha?",
    forgotPasswordTitle: "Esqueceu sua senha?",
    forgotPasswordDescription: "Digite seu e-mail e enviaremos um link para redefinir sua senha.",
    emailRequired: "Digite seu e-mail",
    sendResetLink: "Enviar link de redefinição",
    resetEmailSent: "E-mail enviado",
    checkEmailForReset: "Verifique seu e-mail para redefinir sua senha",
    backToLogin: "Voltar para o login",
    registerTitle: "Criar uma Conta",
    registerDescription: "Preencha suas informações para começar",
    confirmPassword: "Confirmar Senha",
    selectRole: "Selecione sua função",
    athlete: "Atleta",
    admin: "Administrador",
    register: "Cadastrar",
    allFieldsRequired: "Todos os campos são obrigatórios",
    passwordsDontMatch: "As senhas não coincidem",
    passwordTooShort: "A senha deve ter pelo menos 6 caracteres",
    emailAlreadyExists: "Este e-mail já está em uso",
    registerSuccess: "Cadastro Bem-sucedido",
    accountCreated: "Sua conta foi criada com sucesso",
    namePlaceholder: "Seu nome",
    alreadyHaveAccount: "Ainda não possui conta?",
    loginNow: "Cadastre-se",
    loginTitle: "Boas vindas",
    loginDescription: "Entre com seus dados de acesso",
    noAccount: "Ainda não possui conta?",
    registerNow: "Cadastre-se"
  },
  tournament:{
    create: "Criar Torneio"
  },
  // Add remaining translations
};

// Inicializa i18next com configurações simplificadas
i18n
  .use(initReactI18next)
  .init({
     resources: {
      pt: { translation: ptTranslations }, 
     },
    fallbackLng: 'pt',
    lng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
