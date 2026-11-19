import { cores } from "../theme/cores";
import { StatusAgendamento } from "../types/agendamento";

export const corDoStatus: Record<StatusAgendamento, string> = {
  pendente: cores.pendente,
  confirmado: cores.confirmado,
  cancelado: cores.cancelado,
};

export const nomeDoStatus: Record<StatusAgendamento, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};