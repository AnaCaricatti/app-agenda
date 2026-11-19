// Regras de horário. O site tem uma cópia desta mesma lógica em js/horarios.js,
// por isso os dois sempre mostram os mesmos horários livres.
import { Agendamento } from "../types/agendamento";
import { paraISO } from "./datas";

// "14:30" -> 870 (minutos desde a meia-noite)
export function paraMinutos(horario: string): number {
  const [horas, minutos] = horario.split(":").map(Number);
  return horas * 60 + minutos;
}

// 870 -> "14:30"
export function paraHorario(minutos: number): string {
  const horas = String(Math.floor(minutos / 60)).padStart(2, "0");
  const resto = String(minutos % 60).padStart(2, "0");
  return `${horas}:${resto}`;
}

// Calcula o horário de término de um atendimento.
export function calcularFim(horario: string, duracao: number): string {
  return paraHorario(paraMinutos(horario) + duracao);
}

// Lista de horários que podem ser oferecidos na tela "Horários" (07:00 até 20:30).
export function gerarOpcoesDeHorario(): string[] {
  const opcoes: string[] = [];
  for (let minutos = 7 * 60; minutos <= 20 * 60 + 30; minutos += 30) {
    opcoes.push(paraHorario(minutos));
  }
  return opcoes;
}

// Devolve os horários ainda livres em um dia.
//
// horariosDoDia: horários que a profissional oferece naquele dia da semana
// duracao: duração do serviço escolhido (em minutos)
// agendamentosDoDia: agendamentos já existentes naquela data
export function calcularHorariosLivres(
  dataISO: string,
  horariosDoDia: string[],
  duracao: number,
  agendamentosDoDia: Agendamento[]
): string[] {
  const agora = new Date();
  const hojeISO = paraISO(agora);
  if (dataISO < hojeISO) return []; // dia que já passou

  const minutosDeAgora = agora.getHours() * 60 + agora.getMinutes();
  const ocupados = agendamentosDoDia.filter((a) => a.status !== "cancelado");

  return [...horariosDoDia].sort().filter((horario) => {
    const inicio = paraMinutos(horario);
    const fim = inicio + duracao;

    // Hoje, só vale horário que ainda não passou.
    if (dataISO === hojeISO && inicio <= minutosDeAgora) return false;

    // O horário está livre se não "encosta" em nenhum agendamento existente.
    const temConflito = ocupados.some(
      (a) => inicio < paraMinutos(a.horarioFim) && fim > paraMinutos(a.horario)
    );
    return !temConflito;
  });
}
