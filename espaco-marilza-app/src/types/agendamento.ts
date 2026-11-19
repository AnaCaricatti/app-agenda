// O "molde" de um agendamento. Os documentos da coleção "agendamentos"
// do Firebase seguem exatamente este formato (no app e no site).
export type StatusAgendamento = "pendente" | "confirmado" | "cancelado";

// Quem criou o agendamento: a cliente pelo site ou a profissional pelo app.
export type OrigemAgendamento = "site" | "app";

export type Agendamento = {
  id: string;
  clienteNome: string;
  clienteTelefone: string; // só números, com DDD. Exemplo: "37998765432"
  servicoId: string;
  servico: string; // nome do serviço no momento da marcação
  preco: number;
  duracao: number; // em minutos
  data: string; // formato "2026-11-16" (ano-mês-dia)
  horario: string; // início, formato "14:30"
  horarioFim: string; // fim, formato "15:30"
  status: StatusAgendamento;
  origem: OrigemAgendamento;
  criadoEm: string; // data e hora em que foi criado (formato ISO)
};

// Dados necessários para criar um agendamento novo.
// O id, o status e a data de criação são preenchidos pelo serviço.
export type NovoAgendamento = {
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  servico: string;
  preco: number;
  duracao: number;
  data: string;
  horario: string;
};
