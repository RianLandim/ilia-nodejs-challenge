// Simplified i18n replacement (no external dependency)
const translations = {
  auth: {
    login: 'Entrar',
    register: 'Cadastrar',
    logout: 'Sair',
    email: 'Email',
    password: 'Senha',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    loginTitle: 'Bem-vindo de volta',
    loginSubtitle: 'Entre com suas credenciais',
    registerTitle: 'Criar conta',
    registerSubtitle: 'Preencha os dados para criar sua conta',
    alreadyHaveAccount: 'Já tem uma conta?',
    dontHaveAccount: 'Não tem uma conta?',
    loginError: 'Email ou senha inválidos',
    registerError: 'Erro ao criar conta',
  },
  dashboard: {
    title: 'Dashboard',
    balance: 'Saldo',
    recentTransactions: 'Transações Recentes',
    viewAll: 'Ver todas',
    quickActions: 'Ações Rápidas',
    newTransaction: 'Nova Transação',
    noTransactions: 'Nenhuma transação encontrada',
  },
  transactions: {
    title: 'Transações',
    new: 'Nova Transação',
    type: 'Tipo',
    amount: 'Valor',
    date: 'Data',
    credit: 'Crédito',
    debit: 'Débito',
    filter: 'Filtrar',
    all: 'Todas',
    createTitle: 'Criar Transação',
    createSuccess: 'Transação criada com sucesso',
    createError: 'Erro ao criar transação',
    empty: 'Nenhuma transação encontrada',
  },
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Deletar',
    edit: 'Editar',
    back: 'Voltar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
  },
} as const;

type TranslationNamespace = keyof typeof translations;

export function useTranslations(namespace: TranslationNamespace) {
  return (key: string): string => {
    const ns = translations[namespace] as Record<string, string>;
    return ns[key] ?? key;
  };
}
