import { Agendamento } from "../types/agendamento";
import { paraISO, somarDias } from "../utils/datas";

// DADOS DE EXEMPLO (temporários). As datas são calculadas a partir de hoje,
// então sempre aparecem agendamentos perto da data atual.
const hoje = new Date();
const dia = (deslocamento: number) => paraISO(somarDias(hoje, deslocamento));

const agendamentosDeExemplo: Agendamento[] = [
  { id: "1", clienteNome: "Camila Ribeiro", clienteTelefone: "(37) 99876-5432", servico: "Manicure", data: dia(0), horario: "09:00", status: "confirmado" },
  { id: "2", clienteNome: "Fernanda Lopes", clienteTelefone: "(37) 98812-3344", servico: "Pedicure", data: dia(0), horario: "10:30", status: "pendente" },
  { id: "3", clienteNome: "Juliana Alves", clienteTelefone: "(37) 99123-4567", servico: "Esmaltação em gel", data: dia(0), horario: "14:00", status: "pendente" },
  { id: "4", clienteNome: "Patrícia Souza", clienteTelefone: "(37) 99555-1020", servico: "Manicure e pedicure", data: dia(0), horario: "16:00", status: "cancelado" },
  { id: "5", clienteNome: "Renata Martins", clienteTelefone: "(37) 98744-9090", servico: "Manicure", data: dia(1), horario: "09:30", status: "pendente" },
  { id: "6", clienteNome: "Aline Costa", clienteTelefone: "(37) 99001-7788", servico: "Esmaltação em gel", data: dia(1), horario: "15:00", status: "confirmado" },
  { id: "7", clienteNome: "Beatriz Nunes", clienteTelefone: "(37) 98666-2211", servico: "Pedicure", data: dia(2), horario: "11:00", status: "pendente" },
  { id: "8", clienteNome: "Larissa Prado", clienteTelefone: "(37) 99432-8800", servico: "Manicure", data: dia(3), horario: "13:30", status: "confirmado" },
  { id: "9", clienteNome: "Sabrina Dias", clienteTelefone: "(37) 98321-6655", servico: "Manicure e pedicure", data: dia(-1), horario: "10:00", status: "confirmado" },
];

// Busca os agendamentos entre duas datas (inclusive), em ordem de horário.
// Hoje usa os dados de exemplo; depois vai ler do Firebase.
export async function buscarAgendamentos(
  dataInicial: string,
  dataFinal: string
): Promise<Agendamento[]> {
  await new Promise((resolve) => setTimeout(resolve, 400)); // simula a espera da internet

  return agendamentosDeExemplo
    .filter((a) => a.data >= dataInicial && a.data <= dataFinal)
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
}