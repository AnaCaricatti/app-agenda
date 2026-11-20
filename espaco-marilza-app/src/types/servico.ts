// O molde de um serviço (coleção "servicos" do Firebase).
export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // em reais
  duracao: number; // em minutos
  icone: string; // nome do ícone mostrado no app e no site (utils/icones.ts)
};

// Dados de um serviço ainda sem id (usado ao criar um novo).
export type DadosDoServico = Omit<Servico, "id">;
