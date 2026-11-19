// Horários que a profissional disponibiliza para marcação.
//
// A chave é o dia da semana (0 = domingo, 1 = segunda ... 6 = sábado)
// e o valor é a lista de horários de início oferecidos naquele dia.
//
// Exemplo: { "1": ["09:00", "10:00"], "2": [] }
//   -> segunda atende às 9h e às 10h; terça não atende.
export type Expediente = Record<string, string[]>;

export const EXPEDIENTE_VAZIO: Expediente = {
  "0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": [],
};
