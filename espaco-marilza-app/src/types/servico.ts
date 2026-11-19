// O "molde" de um serviço (coleção "servicos" do Firebase).
export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // em reais
  duracao: number; // em minutos
  imagem: string; // endereço (URL) da foto mostrada no site
};

// Dados de um serviço ainda sem id (usado ao criar um novo).
export type DadosDoServico = Omit<Servico, "id">;
