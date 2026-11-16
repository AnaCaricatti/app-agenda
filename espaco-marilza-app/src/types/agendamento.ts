// O "molde" de um agendamento. Quando conectarmos o Firebase,
// os dados do banco precisam seguir este mesmo formato.
export type StatusAgendamento = "pendente" | "confirmado" | "cancelado";

export type Agendamento = {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  servico: string;
  data: string; // formato "2026-11-16" (ano-mês-dia)
  horario: string; // formato "14:30"
  status: StatusAgendamento;
};
//fim do agendamento fictício